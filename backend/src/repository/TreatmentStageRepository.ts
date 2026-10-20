import { Prisma, PrismaClient } from "../generated/prisma/client";
import { TreatmentStageMapper } from "../mapper/TreatmentStage.mapper";
import { TreatmentStage } from "../models/TreatmentStage.model";
import { ConflictError } from "../util/exceptions/http/ConflictError";
import { ITreatmentStageRepository } from "./interfaces/ITreatmentStageRepository";

export class TreatmentStageRepository implements ITreatmentStageRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async findByPlanId(planId: string): Promise<TreatmentStage[]> {
        const tStage = await this.prisma.treatmentStage.findMany({
            where: { planId }, orderBy: { sequence: "asc" }
        });

        return tStage.map(TreatmentStageMapper.toDomain)
    }

    async findById(id: string): Promise<TreatmentStage | null> {
        const tStage = await this.prisma.treatmentStage.findUnique({
            where: { id }
        })
        return tStage ? TreatmentStageMapper.toDomain(tStage) : null
    }

    async save(entity: TreatmentStage): Promise<TreatmentStage> {
        try {
            const row = await this.prisma.treatmentStage.create({
                data: TreatmentStageMapper.toPersistence(entity),
            });
            return TreatmentStageMapper.toDomain(row);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictError('A stage with this sequence already exists in this plan');
            }
            throw error;
        }
    }

    async update(entity: TreatmentStage): Promise<TreatmentStage> {
        const tStage = await this.prisma.treatmentStage.update({
            where: { id: entity.getId() },
            data: TreatmentStageMapper.toPersistence(entity)
        })

        return TreatmentStageMapper.toDomain(tStage)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.treatmentStage.delete({ where: { id } })
    }
}