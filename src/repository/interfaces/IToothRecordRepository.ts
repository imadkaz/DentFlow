import { ToothRecord } from "../../models/ToothRecord.model";
import { IRepository } from "./IRepository";

export interface IToothRecordRepository extends IRepository<ToothRecord> {
    findByPatientAndTooth(patientId: string, toothNumber: number): Promise<ToothRecord | null>;
    findByPatientId(patientId: string): Promise<ToothRecord[]>;
}