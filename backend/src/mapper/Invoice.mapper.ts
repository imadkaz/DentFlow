import { Invoice, InvoiceStatus } from "../models/Invoice.model";
import { Prisma, Invoice as PrismaInvoice } from "../generated/prisma/client";

export class InvoiceMapper {
    static toDomain(raw: PrismaInvoice): Invoice {
        return Invoice.create({
            id: raw.id,
            patientId: raw.patientId,
            clinicId: raw.clinicId,
            planId: raw.planId,
            status: raw.status as InvoiceStatus,
            amount: Number(raw.amount),
            dueDate: new Date(raw.dueDate),
            issuedAt: raw.issuedAt ? new Date(raw.issuedAt) : undefined
        });
    }
    static toPersistence(invoice: Invoice): Prisma.InvoiceUncheckedCreateInput {
        return {
            id: invoice.getId(),
            patientId: invoice.getPatientId(),
            clinicId: invoice.getClinicId(),
            planId: invoice.getPlanId(),
            status: invoice.getStatus(),
            amount: invoice.getAmount(),
            dueDate: invoice.getDueDate(),
            issuedAt: invoice.getIssuedAt()
        };
    }
}