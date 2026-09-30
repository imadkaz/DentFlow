export enum BloodType {
    DEFAULT = 'null',
    A_POSITIVE = 'A+',
    A_NEGATIVE = 'A-',
    B_POSITIVE = 'B+',
    B_NEGATIVE = 'B-',
    AB_POSITIVE = 'AB+',
    AB_NEGATIVE = 'AB-',
    O_POSITIVE = 'O+',
    O_NEGATIVE = 'O-',
}

export interface MedicalRecordProps {
    id: string;
    patientId: string;
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
    bloodType?: BloodType | null;
    notes?: string | null;
    updatedAt?: Date;
}

export class MedicalRecord {
    private constructor(
        private readonly id: string,
        private readonly patientId: string,
        private allergies: string[],
        private conditions: string[],
        private medications: string[],
        private bloodType: BloodType | null,
        private notes: string | null,
        private updatedAt: Date
    ) { }

    static create(props: MedicalRecordProps): MedicalRecord {
        const now = new Date();
        return new MedicalRecord(
            props.id,
            props.patientId,
            props.allergies ?? [],
            props.conditions ?? [],
            props.medications ?? [],
            props.bloodType ?? null,
            props.notes ?? null,
            props.updatedAt ?? now
        )
    }

    getId(): string { return this.id }
    getPatientId(): string { return this.patientId }
    getAllergies(): string[] { return this.allergies }
    getConditions(): string[] { return this.conditions }
    getMedications(): string[] { return this.medications }
    getBloodType(): BloodType | null { return this.bloodType }
    getNotes(): string | null { return this.notes }
    getUpdatedAt(): Date { return this.updatedAt }
}