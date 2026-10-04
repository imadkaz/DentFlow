// src/usecases/patient/DeletePatientUsecase.ts
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class DeletePatientUsecase {
    constructor(private readonly patientRepository: IPatientRepository) {}

    async execute(id: string): Promise<void> {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }
        await this.patientRepository.delete(id);
    }
}