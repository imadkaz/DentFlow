import { Payment } from "../../models/Payment.model";

export interface IPaymentRepository {
    /**
     * Atomically records a payment. Implementations MUST serialize concurrent
     * payments on the same invoice and, inside that critical section, reject with
     * ConflictError when the invoice is void, already fully paid, or when
     * SUM(payments) + payment.amount would exceed the invoice amount.
     * Rejects with NotFoundError if the invoice is not in this clinic.
     */
    recordPayment(payment: Payment, clinicId: string): Promise<Payment>;
    findByInvoiceId(invoiceId: string, clinicId: string): Promise<Payment[]>;
}
