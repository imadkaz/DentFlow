import { ValidationError } from '../util/exceptions/http/ValidationError';

export enum Surface {
    MESIAL = 'mesial', DISTAL = 'distal', BUCCAL = 'buccal',
    LINGUAL = 'lingual', OCCLUSAL = 'occlusal', INCISAL = 'incisal',
}

export enum ToothStatus {
    HEALTHY = 'healthy', TREATMENT_NEEDED = 'treatment_needed', IN_TREATMENT = 'in_treatment',
    COMPLETED = 'completed', MISSING = 'missing', EXTRACTED = 'extracted',
}

export interface ToothRecordProps {
    id: string;
    patientId: string;
    toothNumber: number;
    surfaces?: Surface[];
    status?: ToothStatus;
    notes?: string | null;
    recordedAt?: Date;
}

export class ToothRecord {
    private constructor(
        private readonly id: string,
        private readonly patientId: string,
        private readonly toothNumber: number,   // ✅ readonly — هوية السجل، ما بتتغيّر بالـ update
        private surfaces: Surface[],
        private status: ToothStatus,
        private notes: string | null,
        private recordedAt: Date,
    ) {}

    static create(props: ToothRecordProps): ToothRecord {
        if (!Number.isInteger(props.toothNumber) || props.toothNumber < 1 || props.toothNumber > 32) {
            throw new ValidationError('Tooth number must be an integer between 1 and 32');
        }
        return new ToothRecord(
            props.id,
            props.patientId, 
            props.toothNumber,
            props.surfaces ?? [], 
            props.status ?? ToothStatus.HEALTHY,
            props.notes ?? null, 
            props.recordedAt ?? new Date(),
        );
    }

    getId(): string { return this.id; }
    getPatientId(): string { return this.patientId; }
    getToothNumber(): number { return this.toothNumber; }
    getSurfaces(): Surface[] { return this.surfaces; }
    getStatus(): ToothStatus { return this.status; }
    getNotes(): string | null { return this.notes; }
    getRecordedAt(): Date { return this.recordedAt; }
}