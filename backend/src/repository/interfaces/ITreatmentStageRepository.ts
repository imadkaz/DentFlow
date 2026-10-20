import { TreatmentStage } from "../../models/TreatmentStage.model";
import { IRepository } from "./IRepository";

export interface ITreatmentStageRepository extends IRepository<TreatmentStage> {
    findByPlanId(planId: string): Promise<TreatmentStage[]>;
}