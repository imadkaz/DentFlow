import { PrismaClient } from "../generated/prisma/client";
import { InvoiceMapper, invoiceInclude } from "../mapper/Invoice.mapper";
import { Invoice } from "../models/Invoice.model";
import { ConflictError } from "../util/exceptions/http/ConflictError";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";
import { IInvoiceRepository } from "./interfaces/IInvoiceRepository";

export class InvoiceRepository implements IInvoiceRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string, clinicId: string): Promise<Invoice | null> {
        const raw = await this.prisma.invoice.findFirst({
            where: { id, clinicId },
            include: invoiceInclude,
        });
        return raw ? InvoiceMapper.toDomain(raw) : null;
    }

    async findByPatientId(patientId: string, clinicId: string): Promise<Invoice[]> {
        const raws = await this.prisma.invoice.findMany({
            where: { patientId, clinicId },
            include: invoiceInclude,
            orderBy: { issuedAt: 'desc' },
        });
        return raws.map(InvoiceMapper.toDomain);
    }

    async save(invoice: Invoice): Promise<Invoice> {
        const raw = await this.prisma.invoice.create({
            data: InvoiceMapper.toPersistence(invoice),
            include: invoiceInclude,
        });
        return InvoiceMapper.toDomain(raw);
    }

    async update(invoice: Invoice): Promise<Invoice> {
        const raw = await this.prisma.invoice.update({
            where: { id: invoice.getId() },
            data: InvoiceMapper.toPersistence(invoice),
            include: invoiceInclude,
        });
        return InvoiceMapper.toDomain(raw);
    }

    async voidInvoice(id: string, clinicId: string): Promise<Invoice> {
        return this.prisma.$transaction(async (tx) => {
            // Same row lock as recordPayment: a payment and a void cannot interleave.
            const locked = await tx.$queryRaw<{ id: string }[]>`
                SELECT "id" FROM "invoices"
                WHERE "id" = ${id} AND "clinicId" = ${clinicId}
                FOR UPDATE`;
            if (locked.length === 0) {
                throw new NotFoundError('Invoice not found');
            }

            const current = await tx.invoice.findUniqueOrThrow({ where: { id } });
            if (current.status === 'void') {
                throw new ConflictError('Invoice is already void');
            }
            const paymentCount = await tx.payment.count({ where: { invoiceId: id } });
            if (paymentCount > 0) {
                throw new ConflictError('Cannot void an invoice that has payments');
            }

            const raw = await tx.invoice.update({
                where: { id },
                data: { status: 'void' },
                include: invoiceInclude,
            });
            return InvoiceMapper.toDomain(raw);
        }, { maxWait: 10_000, timeout: 20_000 });
    }
}
