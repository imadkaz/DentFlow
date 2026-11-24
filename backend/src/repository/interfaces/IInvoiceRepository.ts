import { Invoice } from "../../models/Invoice.model";
import { IRepository } from "./IRepository";

export interface IInvoiceRepository extends IRepository<Invoice> {
    findByPatientId(patientId: string): Promise<Invoice[]>;
}