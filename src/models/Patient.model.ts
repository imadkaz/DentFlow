export enum PatientStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    NEW = 'new',
}

export interface PatientProps {
    id: string;
    clinicId: string;
    name: string;
    initials: string;
    status?: PatientStatus;
    balance?: number;
    totalVisits?: number;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    dateOfBirth?: Date | null;
    lastVisit?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Patient {
    private constructor(
        private readonly id: string,
        private readonly clinicId: string,
        private name: string,
        private initials: string,
        private status: PatientStatus,
        private balance: number,
        private totalVisits: number,
        private email: string | null,
        private phone: string | null,
        private address: string | null,
        private dateOfBirth: Date | null,
        private lastVisit: Date | null,
        private readonly createdAt: Date,
        private updatedAt: Date,
    ) {}

    static create(props: PatientProps): Patient {
        const trimmedName = props.name?.trim() ?? '';
        if (trimmedName.length === 0) {
            throw new Error('Patient name is required');
        }
        if (!props.initials || props.initials.length !== 3) {
            throw new Error('Patient initials must be exactly 3 characters');
        }

        const now = new Date();
        return new Patient(
            props.id,
            props.clinicId,
            trimmedName,
            props.initials,
            props.status ?? PatientStatus.NEW,
            props.balance ?? 0,
            props.totalVisits ?? 0,
            props.email ?? null,
            props.phone ?? null,
            props.address ?? null,
            props.dateOfBirth ?? null,
            props.lastVisit ?? null,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

    getId(): string { return this.id; }
    getClinicId(): string { return this.clinicId; }
    getName(): string { return this.name; }
    getInitials(): string { return this.initials; }
    getStatus(): PatientStatus { return this.status; }
    getBalance(): number { return this.balance; }
    getTotalVisits(): number { return this.totalVisits; }
    getEmail(): string | null { return this.email; }
    getPhone(): string | null { return this.phone; }
    getAddress(): string | null { return this.address; }
    getDateOfBirth(): Date | null { return this.dateOfBirth; }
    getLastVisit(): Date | null { return this.lastVisit; }
    getCreatedAt(): Date { return this.createdAt; }
    getUpdatedAt(): Date { return this.updatedAt; }
}