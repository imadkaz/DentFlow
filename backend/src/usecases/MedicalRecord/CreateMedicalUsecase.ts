import { BloodType, MedicalRecord } from "../../models/MedicalRecord.model";
import { MedicalRecordRepository } from "../../repository/MedicalRecordRepository";
import { PatientRepository } from "../../repository/PatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { randomUUID } from "crypto"

export interface CreateMedicalInput{
    patientId: string,
    allergies: string[],
    conditions: string[],
    medications: string[],
    bloodType?: BloodType | null,
    notes?: string | null
}

export class CreateMedialUsecase {
    constructor(
        private readonly medicalRepository: MedicalRecordRepository,
        private readonly patientRepository: PatientRepository
    ){}

    async execute(input: CreateMedicalInput): Promise<MedicalRecord>{
        const patient = await this.patientRepository.findById(input.patientId);

        if(!patient){
            throw new NotFoundError("Patient Not Found!")
        }

        const medicalRecord = MedicalRecord.create({
            id: randomUUID(),
            patientId: input.patientId,
            allergies: input.allergies,
            conditions: input.conditions,
            medications: input.medications,
            bloodType: input.bloodType ?? null,
            notes: input.notes ?? null
        });

        return await this.medicalRepository.save(medicalRecord)
    }
}