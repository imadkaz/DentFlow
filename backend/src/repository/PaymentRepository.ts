import { PrismaClient } from "../generated/prisma/client";
import { PaymentMapper } from "../mapper/Payment.mapper";
import { Payment } from "../models/Payment.model";
import { ConflictError } from "../util/exceptions/http/ConflictError";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";
import { IPaymentRepository } from "./interfaces/IPaymentRepository";

export class PaymentRepository implements IPaymentRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async recordPayment(payment: Payment, clinicId: string): Promise<Payment> {
        return this.prisma.$transaction(async (tx) => {
            // 1. Lock the invoice row. Concurrent payments (and voids) on the same
            //    invoice queue here; each one re-reads the sum after the previous commits.
            const locked = await tx.$queryRaw<{ id: string }[]>`
                SELECT "id" FROM "invoices"
                WHERE "id" = ${payment.getInvoiceId()} AND "clinicId" = ${clinicId}
                FOR UPDATE`;
            if (locked.length === 0) {
                throw new NotFoundError('Invoice not found');
            }

            // 2. Read invoice + current paid sum INSIDE the lock.
            const invoice = await tx.invoice.findUniqueOrThrow({
                where: { id: payment.getInvoiceId() },
            });
            if (invoice.status === 'void') {
                throw new ConflictError('Cannot pay a void invoice');
            }

            const agg = await tx.payment.aggregate({
                where: { invoiceId: invoice.id },
                _sum: { amount: true },
            });
            const amountCents = Math.round(invoice.amount.mul(100).toNumber());
            const paidCents = agg._sum.amount
                ? Math.round(agg._sum.amount.mul(100).toNumber())
                : 0;

            if (paidCents >= amountCents) {
                throw new ConflictError('Invoice is already fully paid');
            }
            if (paidCents + payment.getAmountCents() > amountCents) {
                throw new ConflictError(
                    `Payment exceeds the remaining balance (${amountCents - paidCents} cents)`,
                );
            }

            // 3. Insert. Invoice status is derived on read, so nothing else to update.
            const raw = await tx.payment.create({
                data: PaymentMapper.toPersistence(payment),
            });
            return PaymentMapper.toDomain(raw);
        }, { maxWait: 10_000, timeout: 20_000 });
    }

    async findByInvoiceId(invoiceId: string, clinicId: string): Promise<Payment[]> {
        const raws = await this.prisma.payment.findMany({
            where: { invoiceId, invoice: { clinicId } },
            orderBy: { paidAt: 'asc' },
        });
        return raws.map(PaymentMapper.toDomain);
    }
}
