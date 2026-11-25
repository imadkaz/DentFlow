import { PayMethod, Payment } from "../../models/Payment.model";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { IPaymentRepository } from "../../repository/interfaces/IPaymentRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface RecordPaymentInput {
    clinicId: string;
    invoiceId: string;
    amountCents: number;
    method?: PayMethod;
    reference?: string | null;
    paidAt?: Date;
}

export class RecordPaymentUsecase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly invoiceRepository: IInvoiceRepository
    ) {}

    async execute(input: RecordPaymentInput): Promise<Payment> {
        // Fast, non-authoritative check for a clean 404. The real invariants
        // (void / already paid / overpayment) are enforced inside the repository's
        // locked transaction, because this read can be stale by the time we write.
        const invoice = await this.invoiceRepository.findById(input.invoiceId, input.clinicId);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        const payment = Payment.record({
            id: crypto.randomUUID(),
            invoiceId: invoice.getId(),
            amountCents: input.amountCents,
            method: input.method,
            reference: input.reference,
            paidAt: input.paidAt,
        });

        return this.paymentRepository.recordPayment(payment, input.clinicId);
    }
}
