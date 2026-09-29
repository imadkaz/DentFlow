import { MedicalRecord } from "../../models/MedicalRecord.model";
import { IRepository } from "./IRepository";

export interface IMedicalRecord extends IRepository<MedicalRecord>{
    findByPatient(id: string): Promise<MedicalRecord | null>;
}