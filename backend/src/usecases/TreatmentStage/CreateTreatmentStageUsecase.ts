import { TreatmentStage } from "../../models/TreatmentStage.model";
import { ITreatmentPlanRepository } from "../../repository/interfaces/ITreatmentPlanRepository";
import { ITreatmentStageRepository } from "../../repository/interfaces/ITreatmentStageRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { randomUUID } from "crypto"

export interface CreateTreatmentStageInput {
    planId: string,
    name: string,
    sequence: number,
    notes?: string
}

export class CreateTreatmentStageUsecase {
    constructor(
        private readonly tSRepository: ITreatmentStageRepository,
        private readonly tPRepository: ITreatmentPlanRepository
    ) { }

    async execute(input: CreateTreatmentStageInput): Promise<TreatmentStage> {

        const tPlan = await this.tPRepository.findById(input.planId)
        if (!tPlan) {
            throw new NotFoundError('Treatment Plan not Found!')
        }

        const tStage = TreatmentStage.create({
            id: randomUUID(),
            planId: input.planId,
            name: input.name,
            sequence: input.sequence,
            completed: false,
            completedAt: null,
            notes: input.notes
        })

        return await this.tSRepository.save(tStage)

    }
}