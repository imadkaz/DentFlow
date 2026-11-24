import { PrismaClient } from "../generated/prisma/client";
import { InvoiceMapper } from "../mapper/Invoice.mapper";
import { Invoice } from "../models/Invoice.model";
import { IInvoiceRepository } from "./interfaces/IInvoiceRepository";

export class InvoiceRepository implements IInvoiceRepository {
    constructor(private readonly prisma: PrismaClient) { }


    async findById(id: string): Promise<Invoice | null> {
        const raw = await this.prisma.invoice.findUnique({
            where: { id }
        });

        return raw ? InvoiceMapper.toDomain(raw) : null;
    }
    async findByPatientId(patientId: string): Promise<Invoice[]> {
        const raws = await this.prisma.invoice.findMany({
            where: { patientId }
        });

        return raws.map(InvoiceMapper.toDomain);
    }

    async save(invoice: Invoice): Promise<Invoice> {
        const raw = await this.prisma.invoice.create({
            data: InvoiceMapper.toPersistence(invoice)
        });
        
        return InvoiceMapper.toDomain(raw);
    }
    async update(invoice: Invoice): Promise<Invoice> {
        const raw = await this.prisma.invoice.update({
            where: { id: invoice.getId() },
            data: InvoiceMapper.toPersistence(invoice)
        });

        return InvoiceMapper.toDomain(raw);
    }
    async delete(id: string): Promise<void> {
        await this.prisma.invoice.delete({
            where: { id }
        });
    }
}