import { TreatmentStage } from "../../models/TreatmentStage.model";
import { ITreatmentStageRepository } from "../../repository/interfaces/ITreatmentStageRepository";
import { ConflictError } from "../../util/exceptions/http/ConflictError";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class CompleteTreatmentStageUsecase {
    constructor(
        private readonly tSRepository: ITreatmentStageRepository
    ) { }

    async execute(stageId: string): Promise<TreatmentStage> {
        const stage = await this.tSRepository.findById(stageId);
        if (!stage) {
            throw new NotFoundError("Treatment stage not found!")
        }
        const stages = await this.tSRepository.findByPlanId(stage.getPlanId())

        const hasPendingBefore = stages.some(
            s => s.getSequence() < stage.getSequence() && !s.isCompleted()
        );

        if (hasPendingBefore) {
            throw new ConflictError("Previous stages must be completed first")
        }

        stage.complete();

        return await this.tSRepository.update(stage)


    }
}