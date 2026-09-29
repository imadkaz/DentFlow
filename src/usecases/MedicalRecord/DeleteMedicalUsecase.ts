import { MedicalRecordRepository } from "../../repository/MedicalRecordRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class DeleteMedicalUsecase {
    constructor(private readonly medicalRecordRepository: MedicalRecordRepository) { }

    async execute(id: string): Promise<void> {
        const medical = await this.medicalRecordRepository.findById(id)
        if (!medical) {
            throw new NotFoundError("Medical Not Found!");
        }

        await this.medicalRecordRepository.delete(id)
    }
}