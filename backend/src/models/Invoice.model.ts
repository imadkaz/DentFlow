import { ValidationError } from "../util/exceptions/http/ValidationError";

export enum InvoiceStatus {
   UNPAID = "unpaid",
   PARTIAL = "partial",
   PAID = "paid",
   OVERDUE = "overdue",
   VOID = "void"
}
export interface InvoiceProps {
    id: string;
    patientId: string;
    clinicId: string;
    planId: string;
    status: InvoiceStatus;
    amount: number;
    dueDate: Date;
    issuedAt?: Date;
}

export class Invoice {
    private constructor(
        private readonly id: string,
        private readonly patientId: string,
        private readonly clinicId: string,
        private readonly planId: string,
        private status: InvoiceStatus,
        private amount: number,
        private dueDate: Date,
        private issuedAt?: Date
    ) {}

    static create(props: InvoiceProps): Invoice {

        if(props.amount < 0){
            throw new ValidationError('Invoice amount cannot be negative');
        }

        const now = new Date();
        return new Invoice(
            props.id,
            props.patientId,
            props.clinicId,
            props.planId,
            props.status,
            props.amount,
            props.dueDate,
            props.issuedAt ?? now,
        );
    }
    getId(): string { return this.id; }
    getPatientId(): string { return this.patientId; }
    getClinicId(): string { return this.clinicId; }
    getPlanId(): string { return this.planId; }
    getStatus(): InvoiceStatus { return this.status; }
    getAmount(): number { return this.amount; }
    getDueDate(): Date { return this.dueDate; }
    getIssuedAt(): Date | undefined { return this.issuedAt; }
}