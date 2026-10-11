import { PrismaClient } from "../generated/prisma/client";
import { TreatmentPlanMapper } from "../mapper/TreatmentPlan.mapper";
import { TreatmentPlan } from "../models/TreatmentPlan.model";
import { ITreatmentPlanRepository } from "./interfaces/ITreatmentPlanRepository";

export class TreatmentPlanRepository implements ITreatmentPlanRepository{

    constructor( private readonly prisma : PrismaClient){}
    
    async findActiveByPatient(patientId: string): Promise<TreatmentPlan | null> {
        const row = await this.prisma.treatmentPlan.findFirst({
            where: { patientId, status: 'active' },
        });

        return row ? TreatmentPlanMapper.toDomain(row) : null;
    }

    async findByPatientId(patientId: string): Promise<TreatmentPlan[]> {
        
        const rows = await this.prisma.treatmentPlan.findMany({
            where: { patientId }, orderBy: { startDate: 'desc' },
        });

        return rows.map(TreatmentPlanMapper.toDomain);
    }

    async findById(id: string): Promise<TreatmentPlan | null> {
        const row = await this.prisma.treatmentPlan.findUnique({
            where: { id }
        })

        return row ? TreatmentPlanMapper.toDomain(row) : null
    }

    async save(entity: TreatmentPlan): Promise<TreatmentPlan> {
        const row = await this.prisma.treatmentPlan.create({
            data: TreatmentPlanMapper.toPersistence(entity)
        })

        return TreatmentPlanMapper.toDomain(row);
    }

    async update(entity: TreatmentPlan): Promise<TreatmentPlan> {
        const row = await this.prisma.treatmentPlan.update({
            where: { id: entity.getId() },
            data: TreatmentPlanMapper.toPersistence(entity)
        })
        return TreatmentPlanMapper.toDomain(row)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.treatmentPlan.delete({ where : { id }})
    }
    
}