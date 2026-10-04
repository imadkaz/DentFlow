import { MedicalRecord } from "../../models/MedicalRecord.model";
import { MedicalRecordRepository } from "../../repository/MedicalRecordRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetMedicalUsecase {
    constructor(private readonly medicalRecordRepository: MedicalRecordRepository) { }

    async execute(id: string): Promise<MedicalRecord> {
        const medical = await this.medicalRecordRepository.findById(id)
        if (!medical) {
            throw new NotFoundError("Medical Not Found!");
        }

        return medical
    }
}