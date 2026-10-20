import { Prisma, TreatmentStage as PrismaTreatmentStage } from "../generated/prisma/client";
import { TreatmentStage } from "../models/TreatmentStage.model";

export class TreatmentStageMapper {
    static toDomain(raw: PrismaTreatmentStage): TreatmentStage {
        return TreatmentStage.create({
            id: raw.id,
            planId: raw.planId,
            name: raw.name,
            sequence: raw.sequence,
            completed: raw.completed,
            completedAt: raw.completedAt,
            notes: raw.notes
        })
    }
    static toPersistence(treatmentStage: TreatmentStage): Prisma.TreatmentStageUncheckedCreateInput {
        return {
            id: treatmentStage.getId(),
            planId: treatmentStage.getPlanId(),
            name: treatmentStage.getName(),
            sequence: treatmentStage.getSequence(),
            completed: treatmentStage.isCompleted(),
            completedAt: treatmentStage.getCompletedAt(),
            notes: treatmentStage.getNotes()
        }
    }
}