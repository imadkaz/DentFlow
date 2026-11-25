import { Invoice } from "../../models/Invoice.model";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";

export class VoidInvoiceUsecase {
    constructor(private readonly invoiceRepository: IInvoiceRepository) {}

    // The "no payments / not already void" rule is enforced atomically in the repository.
    async execute(invoiceId: string, clinicId: string): Promise<Invoice> {
        return this.invoiceRepository.voidInvoice(invoiceId, clinicId);
    }
}
