import { Invoice } from "../../models/Invoice.model";

/**
 * Deliberately does NOT extend IRepository: invoices are financial records
 * and are never hard-deleted. Every read is scoped by clinicId (tenant isolation).
 */
export interface IInvoiceRepository {
    findById(id: string, clinicId: string): Promise<Invoice | null>;
    findByPatientId(patientId: string, clinicId: string): Promise<Invoice[]>;
    save(invoice: Invoice): Promise<Invoice>;
    update(invoice: Invoice): Promise<Invoice>;
    /**
     * Atomically voids an invoice. Must fail with ConflictError if the invoice
     * already has payments or is already void, and with NotFoundError if it
     * does not exist in this clinic.
     */
    voidInvoice(id: string, clinicId: string): Promise<Invoice>;
}
