import { TreatmentPlanRepository } from "../../repository/TreatmentPlanRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";


export class DeleteTreatmentPlanUsecase {
    constructor(
        private readonly treatmentPlanRepository: TreatmentPlanRepository
    ) { }

    async execute(id : string): Promise<void> {
        const treatmentPlan = await this.treatmentPlanRepository.findById(id);
        if (!treatmentPlan) {
            throw new NotFoundError("Treatment plan not found!");
        }

        await this.treatmentPlanRepository.delete(id)

    }
}
