import { ToothRecord } from "../../models/ToothRecord.model";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { IToothRecordRepository } from "../../repository/interfaces/IToothRecordRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";


export class GetPatientTeethUsecase {
    constructor(
        private readonly toothRecordRepository: IToothRecordRepository,
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(patientId: string): Promise<ToothRecord[]> {
        const patient = await this.patientRepository.findById(patientId);
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }
        return this.toothRecordRepository.findByPatientId(patientId);
    }
}