// src/usecases/patient/GetPatientUsecase.ts
import { Patient } from "../../models/Patient.model";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetPatientUsecase {
    constructor(private readonly patientRepository: IPatientRepository) {}

    async executeById(id: string): Promise<Patient> {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }
        return patient;
    }

    async executeByName(name: string): Promise<Patient[]> {
        return this.patientRepository.findByName(name);
    }
}