import { Payment, PayMethod } from "../models/Payment.model";
import { Prisma, Payment as PrismaPayment } from "../generated/prisma/client";

export class PaymentMapper {
    static toDomain(raw: PrismaPayment): Payment {
        return Payment.create({
            id: raw.id,
            invoiceId: raw.invoiceId,
            amountCents: Math.round(raw.amount.mul(100).toNumber()),
            method: raw.method as PayMethod,
            reference: raw.reference,
            paidAt: raw.paidAt,
        });
    }

    static toPersistence(payment: Payment): Prisma.PaymentUncheckedCreateInput {
        return {
            id: payment.getId(),
            invoiceId: payment.getInvoiceId(),
            amount: new Prisma.Decimal(payment.getAmountCents()).div(100),
            method: payment.getMethod(),
            reference: payment.getReference(),
            paidAt: payment.getPaidAt(),
        };
    }
}
