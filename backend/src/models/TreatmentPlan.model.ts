import { ValidationError } from "../util/exceptions/http/ValidationError";

export enum PlanStatus {
    ACTIVE = 'active',
    COMPLETE = 'completed',
    PENDING = 'pending',
    CANCELLED = 'cancelled'
}

export interface TreatmentPlanProps {
    id: string,
    patientId: string,
    doctorId: string,
    treatmentType: string,
    startDate: Date,
    endDate?: Date | null,
    totalCost: number,
    paidAmount?: number,
    status?: PlanStatus,
    nextApptAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date
}
export class TreatmentPlan {
    private constructor(
        private readonly id: string,
        private readonly patientId: string,
        private readonly doctorId: string,
        private treatmentType: string,
        private startDate: Date,
        private endDate: Date | null,
        private totalCost: number,
        private paidAmount: number,
        private status: PlanStatus,
        private nextApptAt: Date | null,
        private createdAt: Date,
        private updatedAt: Date
    ) { }

    static create(props: TreatmentPlanProps): TreatmentPlan {

        const trimmedType = props.treatmentType?.trim() ?? '';
        if (trimmedType.length === 0) {
            throw new ValidationError('Treatment type is required');
        }
        if (props.totalCost < 0) {
            throw new ValidationError('Total cost cannot be negative');
        }
        const paidAmount = props.paidAmount ?? 0;
        if (paidAmount < 0) {
            throw new ValidationError('Paid amount cannot be negative');
        }
        if (paidAmount > props.totalCost) {
            throw new ValidationError('Paid amount cannot exceed total cost');
        }
        const now = new Date();

        return new TreatmentPlan(
            props.id,
            props.patientId,
            props.doctorId,
            props.treatmentType,
            props.startDate,
            props.endDate ?? null,
            props.totalCost,
            props.paidAmount ?? 0,
            props.status ?? PlanStatus.PENDING,
            props.nextApptAt ?? null,
            props.createdAt ?? now,
            props.updatedAt ?? now
        );



    }
    getId(): string { return this.id }
    getPatientId(): string { return this.patientId }
    getDoctorId(): string { return this.doctorId }
    getTreatmentType(): string { return this.treatmentType }
    getStartDate(): Date { return this.startDate }
    getEndDate(): Date | null { return this.endDate }
    getTotalCost(): number { return this.totalCost }
    getPaidAmount(): number { return this.paidAmount }
    getStatus(): PlanStatus { return this.status }
    getNextAppAt(): Date | null { return this.nextApptAt }
    getCreatedAt(): Date { return this.createdAt }
    getUpdatedAt(): Date { return this.updatedAt }
}