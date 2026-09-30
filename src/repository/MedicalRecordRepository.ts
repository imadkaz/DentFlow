import { PrismaClient } from "../generated/prisma/client";
import { MedicalRecordMapper } from "../mapper/MedicalRecord.mapper";
import { MedicalRecord } from "../models/MedicalRecord.model";
import { IMedicalRecord } from "./interfaces/IMedicalRecordRepository";

export class MedicalRecordRepository implements IMedicalRecord{

    constructor(private readonly prisma: PrismaClient){}

    async findById(id: string): Promise<MedicalRecord | null> {
        const row = await this.prisma.medicalRecord.findUnique({
            where: {id}
        })

        return row ? MedicalRecordMapper.toDomain(row) : null;
    }
    async findByPatient(patientId: string): Promise<MedicalRecord | null> {
        const row = await this.prisma.medicalRecord.findUnique({
            where: {patientId}
        })

        return row ? MedicalRecordMapper.toDomain(row) : null;
    }
    async save(entity: MedicalRecord): Promise<MedicalRecord> {
        const raw = await this.prisma.medicalRecord.create({
            data: MedicalRecordMapper.toPersistence(entity)
        })

        return MedicalRecordMapper.toDomain(raw)
    }

    async update(entity: MedicalRecord): Promise<MedicalRecord> {
        const raw = await this.prisma.medicalRecord.update({
            where: {id: entity.getId()},
            data: MedicalRecordMapper.toPersistence(entity)
        })
        
        return MedicalRecordMapper.toDomain(raw)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.medicalRecord.delete({ where: {id} })
    }
    
}