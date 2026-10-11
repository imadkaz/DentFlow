import { TreatmentPlan } from "../../models/TreatmentPlan.model";
import { ITreatmentPlanRepository } from "../../repository/interfaces/ITreatmentPlanRepository";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetPatientTreatmentsUsecase {
    constructor(
        private readonly treatmentPlanRepository: ITreatmentPlanRepository,
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(patientId: string): Promise<TreatmentPlan[]> {
        const patient = await this.patientRepository.findById(patientId);
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }
        return this.treatmentPlanRepository.findByPatientId(patientId);
    }
}