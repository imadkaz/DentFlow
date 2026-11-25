import { ValidationError } from "../util/exceptions/http/ValidationError";

export enum PayMethod {
    CASH = "cash",
    CARD = "card",
    INSURANCE = "insurance",
    BANK_TRANSFER = "bank_transfer",
    OTHER = "other"
}

/** Methods that must carry a reference (receipt / transfer number). Business rule, change here. */
const METHODS_REQUIRING_REFERENCE: PayMethod[] = [PayMethod.CARD, PayMethod.BANK_TRANSFER];

const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

export interface PaymentProps {
    id: string;
    invoiceId: string;
    amountCents: number;
    method?: PayMethod;
    reference?: string | null;
    paidAt?: Date;
}

export class Payment {
    private constructor(
        private readonly id: string,
        private readonly invoiceId: string,
        private readonly amountCents: number,
        private readonly method: PayMethod,
        private readonly reference: string | null,
        private readonly paidAt: Date,
    ) {}

    static create(props: PaymentProps): Payment {
        if (!Number.isInteger(props.amountCents) || props.amountCents <= 0) {
            throw new ValidationError('Payment amount must be a positive integer (cents)');
        }
        const method = props.method ?? PayMethod.CASH;
        if (!Object.values(PayMethod).includes(method)) {
            throw new ValidationError('Invalid payment method');
        }
        const reference = props.reference?.trim() || null;
        if (reference && reference.length > 80) {
            throw new ValidationError('Payment reference must be at most 80 characters');
        }
        const paidAt = props.paidAt ?? new Date();
        if (isNaN(paidAt.getTime())) {
            throw new ValidationError('Invalid paidAt date');
        }
        return new Payment(props.id, props.invoiceId, props.amountCents, method, reference, paidAt);
    }

    /** Record a brand-new payment: structural checks + business rules. Loading from the DB uses `create`. */
    static record(props: PaymentProps): Payment {
        const payment = Payment.create(props);
        if (!payment.reference && METHODS_REQUIRING_REFERENCE.includes(payment.method)) {
            throw new ValidationError(`A reference is required for ${payment.method} payments`);
        }
        if (payment.paidAt.getTime() > Date.now() + MAX_CLOCK_SKEW_MS) {
            throw new ValidationError('paidAt cannot be in the future');
        }
        return payment;
    }

    getId(): string { return this.id; }
    getInvoiceId(): string { return this.invoiceId; }
    getAmountCents(): number { return this.amountCents; }
    getMethod(): PayMethod { return this.method; }
    getReference(): string | null { return this.reference; }
    getPaidAt(): Date { return this.paidAt; }
}
