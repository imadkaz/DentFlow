import { TreatmentPlan } from "../../models/TreatmentPlan.model";
import { TreatmentPlanRepository } from "../../repository/TreatmentPlanRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";


export class GetTreatmentPlanUsecase {
    constructor(
        private readonly treatmentPlanRepository: TreatmentPlanRepository
    ) { }

    async execute(id : string): Promise<TreatmentPlan> {
        const treatmentPlan = await this.treatmentPlanRepository.findById(id);
        if (!treatmentPlan) {
            throw new NotFoundError("Treatment plan not found!");
        }



        return treatmentPlan;
    }
}
