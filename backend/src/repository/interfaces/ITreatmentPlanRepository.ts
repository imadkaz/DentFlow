import { TreatmentPlan } from "../../models/TreatmentPlan.model";
import { IRepository } from "./IRepository";

export interface ITreatmentPlanRepository extends IRepository<TreatmentPlan>{
    findActiveByPatient(patientId: string): Promise<TreatmentPlan | null>;
    findByPatientId(patientId: string): Promise<TreatmentPlan[]>;
}