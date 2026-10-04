import { BloodType, MedicalRecord } from "../../models/MedicalRecord.model";
import { MedicalRecordRepository } from "../../repository/MedicalRecordRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface UpdateMedicalInput{
    id: string,
    allergies?: string[],
    conditions?: string[],
    medications?: string[],
    bloodType?: BloodType,
    notes?: string | null
}

export class UpdateMedicalUsecase{
    constructor(private readonly medicalRecordRepository: MedicalRecordRepository){}

    async execute(input: UpdateMedicalInput): Promise<MedicalRecord>{
        const existMedical = await this.medicalRecordRepository.findById(input.id)
        if(!existMedical){
            throw new NotFoundError("Medical Not Found!");
        }

        const updateMedical = MedicalRecord.create({
            id: input.id,
            patientId: existMedical.getPatientId(),
            allergies: input.allergies !== undefined ? input.allergies : existMedical.getAllergies(),
            conditions: input.conditions !== undefined  ? input.conditions : existMedical.getConditions(),
            medications: input.medications !== undefined ? input.medications : existMedical.getMedications(),
            bloodType: input.bloodType !== undefined ? input.bloodType : existMedical.getBloodType(),
            notes: input.notes !== undefined ? input.notes : existMedical.getNotes(),
            updatedAt: new Date()
        })

        return await this.medicalRecordRepository.update(updateMedical)
    }

}