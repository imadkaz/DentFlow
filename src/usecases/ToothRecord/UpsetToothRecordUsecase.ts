import { Surface, ToothRecord, ToothStatus } from "../../models/ToothRecord.model";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { IToothRecordRepository } from "../../repository/interfaces/IToothRecordRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { randomUUID } from "crypto";


export interface UpsertToothRecordInput {
    patientId: string;
    toothNumber: number;
    surfaces?: Surface[];
    status?: ToothStatus;
    notes?: string | null;
}

export class UpsetToothRecordUsecase {
    constructor(
        private readonly toothRecordRepository: IToothRecordRepository,
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(input: UpsertToothRecordInput): Promise<ToothRecord> {
        const patient = await this.patientRepository.findById(input.patientId);
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }

        const existing = await this.toothRecordRepository.findByPatientAndTooth(input.patientId, input.toothNumber);

        if (existing) {
            const updated = ToothRecord.create({
                id: existing.getId(),
                patientId: existing.getPatientId(),
                toothNumber: existing.getToothNumber(),
                surfaces: input.surfaces !== undefined ? input.surfaces : existing.getSurfaces(),
                status: input.status !== undefined ? input.status : existing.getStatus(),
                notes: input.notes !== undefined ? input.notes : existing.getNotes(),
                recordedAt: new Date(),
            });
            return this.toothRecordRepository.update(updated);
        }

        const created = ToothRecord.create({
            id: randomUUID(),
            patientId: input.patientId,
            toothNumber: input.toothNumber,
            surfaces: input.surfaces,
            status: input.status,
            notes: input.notes,
        });
        return this.toothRecordRepository.save(created);
    }
}