import { Prisma, MedicalRecord as PrismaMedical } from '../generated/prisma/client' 
import { BloodType, MedicalRecord } from '../models/MedicalRecord.model';

export class MedicalRecordMapper {
    static toDomain(raw: PrismaMedical): MedicalRecord{
        return MedicalRecord.create({
            id: raw.id,
            patientId: raw.patientId,
            allergies: raw.allergies,
            conditions: raw.conditions,
            medications: raw.medications,
            bloodType: raw.bloodType as BloodType,
            notes: raw.notes,
            updatedAt: raw.updatedAt
        })
    }

    static toPersistence(medicalRecord: MedicalRecord): Prisma.MedicalRecordUncheckedCreateInput{
        return {
            id: medicalRecord.getId(),
            patientId: medicalRecord.getPatientId(),
            allergies: medicalRecord.getAllergies(),
            conditions: medicalRecord.getConditions(),
            medications: medicalRecord.getMedications(),
            bloodType: medicalRecord.getBloodType(),
            notes: medicalRecord.getNotes(),
            updatedAt: medicalRecord.getUpdatedAt()
        }
    } 
}