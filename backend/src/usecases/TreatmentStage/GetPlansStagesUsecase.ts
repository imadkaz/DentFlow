import { TreatmentStage } from "../../models/TreatmentStage.model";
import { ITreatmentPlanRepository } from "../../repository/interfaces/ITreatmentPlanRepository";
import { ITreatmentStageRepository } from "../../repository/interfaces/ITreatmentStageRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

// GetPlanStagesUsecase.ts
export class GetPlanStagesUsecase {
    constructor(
        private readonly stageRepository: ITreatmentStageRepository,
        private readonly planRepository: ITreatmentPlanRepository,
    ) { }

    async execute(planId: string): Promise<TreatmentStage[]> {
        const plan = await this.planRepository.findById(planId);
        if (!plan) throw new NotFoundError('Treatment plan not found');
        return this.stageRepository.findByPlanId(planId);
    }
}