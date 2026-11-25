import { ValidationError } from "../util/exceptions/http/ValidationError";
import { formatDateOnly, toBeirutDateString, todayInBeirut } from "../util/date";

export enum InvoiceStatus {
    UNPAID = "unpaid",
    PARTIAL = "partial",
    PAID = "paid",
    OVERDUE = "overdue",
    VOID = "void"
}

export interface InvoiceProps {
    id: string;
    clinicId: string;
    patientId: string;
    planId: string;
    amountCents: number;
    dueDate: Date;
    issuedAt?: Date;
    /** Persisted flag. Every other status is derived (decision D6). */
    voided?: boolean;
    /** Derived from payments by the repository; never persisted on the invoice. */
    paidCents?: number;
}

export class Invoice {
    private constructor(
        private readonly id: string,
        private readonly clinicId: string,
        private readonly patientId: string,
        private readonly planId: string,
        private readonly amountCents: number,
        private dueDate: Date,
        private readonly issuedAt: Date,
        private readonly voided: boolean,
        private readonly paidCents: number,
    ) {}

    /** Rehydrate an existing invoice (e.g. from the DB). Structural checks only. */
    static create(props: InvoiceProps): Invoice {
        if (!Number.isInteger(props.amountCents) || props.amountCents <= 0) {
            throw new ValidationError('Invoice amount must be a positive integer (cents)');
        }
        if (!(props.dueDate instanceof Date) || isNaN(props.dueDate.getTime())) {
            throw new ValidationError('Invalid due date');
        }
        const paidCents = props.paidCents ?? 0;
        if (!Number.isInteger(paidCents) || paidCents < 0) {
            throw new ValidationError('Paid amount must be a non-negative integer (cents)');
        }
        return new Invoice(
            props.id,
            props.clinicId,
            props.patientId,
            props.planId,
            props.amountCents,
            props.dueDate,
            props.issuedAt ?? new Date(),
            props.voided ?? false,
            paidCents,
        );
    }

    /** Issue a brand-new invoice: structural checks + business rules. */
    static issue(props: Omit<InvoiceProps, 'issuedAt' | 'voided' | 'paidCents'>): Invoice {
        const issuedAt = new Date();
        Invoice.assertDueDateNotBeforeIssue(props.dueDate, issuedAt);
        return Invoice.create({ ...props, issuedAt });
    }

    private static assertDueDateNotBeforeIssue(dueDate: Date, issuedAt: Date): void {
        if (!(dueDate instanceof Date) || isNaN(dueDate.getTime())) {
            throw new ValidationError('Invalid due date');
        }
        // Compare calendar dates (Beirut), never raw timestamps.
        if (formatDateOnly(dueDate) < toBeirutDateString(issuedAt)) {
            throw new ValidationError('Due date cannot be before the issue date');
        }
    }

    changeDueDate(newDueDate: Date): void {
        Invoice.assertDueDateNotBeforeIssue(newDueDate, this.issuedAt);
        this.dueDate = newDueDate;
    }

    /**
     * Effective status, derived on read. `today` is a Beirut 'YYYY-MM-DD'
     * (injectable for tests).
     */
    getStatus(today: string = todayInBeirut()): InvoiceStatus {
        if (this.voided) return InvoiceStatus.VOID;
        if (this.paidCents >= this.amountCents) return InvoiceStatus.PAID;
        if (formatDateOnly(this.dueDate) < today) return InvoiceStatus.OVERDUE;
        if (this.paidCents > 0) return InvoiceStatus.PARTIAL;
        return InvoiceStatus.UNPAID;
    }

    getId(): string { return this.id; }
    getClinicId(): string { return this.clinicId; }
    getPatientId(): string { return this.patientId; }
    getPlanId(): string { return this.planId; }
    getAmountCents(): number { return this.amountCents; }
    getPaidCents(): number { return this.paidCents; }
    getBalanceCents(): number { return this.amountCents - this.paidCents; }
    getDueDate(): Date { return this.dueDate; }
    getIssuedAt(): Date { return this.issuedAt; }
    isVoided(): boolean { return this.voided; }
}
