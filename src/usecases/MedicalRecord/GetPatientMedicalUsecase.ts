import { MedicalRecord } from "../../models/MedicalRecord.model";
import { MedicalRecordRepository } from "../../repository/MedicalRecordRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetPatientMedicalUsecase {
    constructor(
        private medicalRepository: MedicalRecordRepository
    ){}

    async execute(id: string): Promise<MedicalRecord | null> {
        const medical = await this.medicalRepository.findByPatient(id)
        if(!id){
            throw new NotFoundError("Medical not Found!");
        }

        return medical
    }
}