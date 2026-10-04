import { Doctor } from "../../models/Doctor.model";
import { IClinicRepository } from "../../repository/interfaces/IClinicRepository";
import { IDoctorRepository } from "../../repository/interfaces/IDoctorRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetClinicDoctorUsecase {
    constructor(
        private readonly doctorRepository: IDoctorRepository,
        private readonly clinicRepository: IClinicRepository
    ){}

    async execute(clinicId: string): Promise<Doctor[]> {
        const clinic = await this.clinicRepository.findById(clinicId);
        if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }
        
        return this.doctorRepository.findByClinicId(clinicId)
    }
}