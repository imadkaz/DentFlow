import { Patient } from "../../models/Patient.model";
import { IRepository } from "./IRepository";

export interface IPatientRepository extends IRepository<Patient>{
    findByName(name: string): Promise<Patient[]>;
}   