import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetInvoiceUsecase {
    constructor(private readonly invoiceRepository: IInvoiceRepository) {}

    async executeById(invoiceId: string) {
        const invoice = await this.invoiceRepository.findById(invoiceId);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        return invoice;
    }
}