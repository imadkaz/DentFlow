import { Payment } from "../../models/Payment.model";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { IPaymentRepository } from "../../repository/interfaces/IPaymentRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetInvoicePaymentsUsecase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly invoiceRepository: IInvoiceRepository
    ) {}

    async execute(invoiceId: string, clinicId: string): Promise<Payment[]> {
        const invoice = await this.invoiceRepository.findById(invoiceId, clinicId);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }
        return this.paymentRepository.findByInvoiceId(invoiceId, clinicId);
    }
}
