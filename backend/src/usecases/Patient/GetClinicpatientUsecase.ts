import { Patient } from "../../models/Patient.model";
import { ClinicRepository } from "../../repository/ClinicRepository";
import { PatientRepository } from "../../repository/PatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetClinicPatientUsecase {
    constructor(
        private readonly patientRepository: PatientRepository,
        private readonly clinicRepository : ClinicRepository
    ){}

    async execute(clinicId: string) : Promise<Patient[]> {
        const clinic = await this.clinicRepository.findById(clinicId)
         if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }

        return await this.patientRepository.findByClinicId(clinicId)
    }
}