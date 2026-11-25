import { Invoice, InvoiceStatus } from "../models/Invoice.model";
import { Prisma } from "../generated/prisma/client";

export type PrismaInvoiceWithPayments = Prisma.InvoiceGetPayload<{
    include: { payments: { select: { amount: true } } };
}>;

export const invoiceInclude = { payments: { select: { amount: true } } } as const;

export class InvoiceMapper {
    static toDomain(raw: PrismaInvoiceWithPayments): Invoice {
        const paidCents = raw.payments.reduce(
            (sum, p) => sum + Math.round(p.amount.mul(100).toNumber()),
            0,
        );
        return Invoice.create({
            id: raw.id,
            clinicId: raw.clinicId,
            patientId: raw.patientId,
            planId: raw.planId,
            amountCents: Math.round(raw.amount.mul(100).toNumber()),
            dueDate: raw.dueDate,
            issuedAt: raw.issuedAt,
            voided: raw.status === 'void',
            paidCents,
        });
    }

    /**
     * Only `unpaid` / `void` are ever stored. partial / paid / overdue are
     * derived on read (decision D6), so they can never drift from payments.
     */
    static toPersistence(invoice: Invoice): Prisma.InvoiceUncheckedCreateInput {
        return {
            id: invoice.getId(),
            clinicId: invoice.getClinicId(),
            patientId: invoice.getPatientId(),
            planId: invoice.getPlanId(),
            status: invoice.isVoided() ? InvoiceStatus.VOID : InvoiceStatus.UNPAID,
            amount: new Prisma.Decimal(invoice.getAmountCents()).div(100),
            dueDate: invoice.getDueDate(),
            issuedAt: invoice.getIssuedAt(),
        };
    }
}
