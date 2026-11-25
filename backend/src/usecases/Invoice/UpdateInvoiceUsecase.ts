import { Invoice } from "../../models/Invoice.model";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { ConflictError } from "../../util/exceptions/http/ConflictError";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

/**
 * Only the due date is editable. Amount and status are NOT editable here:
 * status is derived from payments, voiding has its own use case, and the
 * amount is immutable (correct a mistake by voiding and re-issuing).
 */
export interface InvoiceUpdateInput {
    id: string;
    clinicId: string;
    dueDate: Date;
}

export class UpdateInvoiceUsecase {
    constructor(private readonly invoiceRepository: IInvoiceRepository) {}

    async execute(input: InvoiceUpdateInput): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findById(input.id, input.clinicId);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }
        if (invoice.isVoided()) {
            throw new ConflictError('Cannot edit a void invoice');
        }

        invoice.changeDueDate(input.dueDate);
        return this.invoiceRepository.update(invoice);
    }
}
