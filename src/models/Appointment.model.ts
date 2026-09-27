// src/models/Appointment.model.ts
export enum AppointmentStatus {
    CONFIRMED = 'confirmed',
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    IN_PROGRESS = 'in_progress',
}

export interface AppointmentProps {
    id: string;
    patientId: string;
    doctorId: string;
    procedure: string;
    apptDate: Date;
    apptTime: Date;
    durationMin?: number;
    status?: AppointmentStatus;
    notes?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Appointment {
    private constructor(
        private readonly id: string,
        private readonly patientId: string,
        private readonly doctorId: string,
        private procedure: string,
        private apptDate: Date,
        private apptTime: Date,
        private durationMin: number,
        private status: AppointmentStatus,
        private notes: string | null,
        private readonly createdAt: Date,
        private updatedAt: Date,
    ) {}

    static create(props: AppointmentProps): Appointment {
        const trimmedProcedure = props.procedure?.trim() ?? '';
        if (trimmedProcedure.length === 0) {
            throw new Error('Appointment procedure is required');
        }
        if (trimmedProcedure.length > 120) {
            throw new Error('Appointment procedure must be at most 120 characters');
        }
        if (props.durationMin !== undefined && props.durationMin <= 0) {
            throw new Error('Appointment duration must be greater than zero');
        }

        const now = new Date();
        return new Appointment(
            props.id,
            props.patientId,
            props.doctorId,
            trimmedProcedure,
            props.apptDate,
            props.apptTime,
            props.durationMin ?? 30,
            props.status ?? AppointmentStatus.PENDING,
            props.notes ?? null,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

    getId(): string { return this.id; }
    getPatientId(): string { return this.patientId; }
    getDoctorId(): string { return this.doctorId; }
    getProcedure(): string { return this.procedure; }
    getApptDate(): Date { return this.apptDate; }
    getApptTime(): Date { return this.apptTime; }
    getDurationMin(): number { return this.durationMin; }
    getStatus(): AppointmentStatus { return this.status; }
    getNotes(): string | null { return this.notes; }
    getCreatedAt(): Date { return this.createdAt; }
    getUpdatedAt(): Date { return this.updatedAt; }
}