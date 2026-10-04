import { Prisma, ToothRecord as PrismaToothRecord } from '../generated/prisma/client';
import { ToothRecord, Surface, ToothStatus } from '../models/ToothRecord.model';

export class ToothRecordMapper {
    static toDomain(raw: PrismaToothRecord): ToothRecord {
        return ToothRecord.create({
            id: raw.id, patientId: raw.patientId, toothNumber: raw.toothNumber,
            surfaces: raw.surfaces as Surface[], status: raw.status as ToothStatus,
            notes: raw.notes, recordedAt: raw.recordedAt,
        });
    }
    static toPersistence(record: ToothRecord): Prisma.ToothRecordUncheckedCreateInput {
        return {
            id: record.getId(), patientId: record.getPatientId(), toothNumber: record.getToothNumber(),
            surfaces: record.getSurfaces(), status: record.getStatus(),
            notes: record.getNotes(), recordedAt: record.getRecordedAt(),
        };
    }
}