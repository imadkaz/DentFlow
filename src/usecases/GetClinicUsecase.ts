import { Clinic } from "../models/Clinic.model";
import { IClinicRepository } from "../repository/IClinicRepository";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";

export class GetClinicUsecase {
    constructor(private readonly clinicRepository: IClinicRepository) {}

    async executeByID(id: string): Promise<Clinic> {
        const clinic = await this.clinicRepository.findById(id);
        if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }
        return clinic;
    }
    async executeByEmail(email: string): Promise<Clinic> {
        const clinic = await this.clinicRepository.findByEmail(email);
        if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }
        return clinic;
    }
}