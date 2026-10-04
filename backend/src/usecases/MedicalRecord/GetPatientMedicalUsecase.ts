import { MedicalRecord } from "../../models/MedicalRecord.model";
import { MedicalRecordRepository } from "../../repository/MedicalRecordRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetPatientMedicalUsecase {
    constructor(
        private readonly medicalRepository: MedicalRecordRepository
    ){}

    async execute(id: string): Promise<MedicalRecord | null> {
        const medical = await this.medicalRepository.findByPatient(id)
        if(!medical){
            throw new NotFoundError("Medical not Found!");
        }

        return medical
    }
}