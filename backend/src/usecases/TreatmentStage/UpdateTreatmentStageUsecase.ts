import { TreatmentStage } from "../../models/TreatmentStage.model";
import { ITreatmentStageRepository } from "../../repository/interfaces/ITreatmentStageRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface UpdateTreatmentStageProps {
    id: string,
    name?: string
    notes?: string
}

export class UpdateTreatmentStageUsecase {
    constructor(
        private readonly tSRepository: ITreatmentStageRepository
    ) { }

    async execute(input: UpdateTreatmentStageProps): Promise<TreatmentStage> {
        const existingTreatmentStage = await this.tSRepository.findById(input.id)
        if (!existingTreatmentStage) {
            throw new NotFoundError("There isn't a treatment stage to update!")
        }
        const tStage = TreatmentStage.create({
            id: existingTreatmentStage.getId(),
            planId: existingTreatmentStage.getPlanId(),
            name: input.name !== undefined ? input.name : existingTreatmentStage.getName(),
            sequence: existingTreatmentStage.getSequence(),
            completed: existingTreatmentStage.isCompleted(),
            completedAt: existingTreatmentStage.getCompletedAt(),
            notes: input.notes !== undefined ? input.notes : existingTreatmentStage.getNotes()
        })

        return await this.tSRepository.update(tStage)
    }



}