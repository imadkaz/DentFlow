import { PrismaClient } from "../generated/prisma/client";
import { ToothRecordMapper } from "../mapper/ToothRecord.mapper";
import { ToothRecord } from "../models/ToothRecord.model";
import { IToothRecordRepository } from "./interfaces/IToothRecordRepository";

// ToothRecordRepository.ts
export class ToothRecordRepository implements IToothRecordRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(id: string) {
        const raw = await this.prisma.toothRecord.findUnique({ where: { id } });
        return raw ? ToothRecordMapper.toDomain(raw) : null;
    }

    async findByPatientAndTooth(patientId: string, toothNumber: number) {
        const raw = await this.prisma.toothRecord.findUnique({
            where: { patientId_toothNumber: { patientId, toothNumber } },   // ✅ اسم مركّب، تلقائي من Prisma
        });
        return raw ? ToothRecordMapper.toDomain(raw) : null;
    }

    async findByPatientId(patientId: string) {
        const rows = await this.prisma.toothRecord.findMany({
            where: { patientId }, orderBy: { toothNumber: 'asc' },
        });
        return rows.map(ToothRecordMapper.toDomain);
    }

    async save(entity: ToothRecord) {
        const raw = await this.prisma.toothRecord.create({ data: ToothRecordMapper.toPersistence(entity) });
        return ToothRecordMapper.toDomain(raw);
    }

    async update(entity: ToothRecord) {
        const raw = await this.prisma.toothRecord.update({
            where: { id: entity.getId() }, data: ToothRecordMapper.toPersistence(entity),
        });
        return ToothRecordMapper.toDomain(raw);
    }

    async delete(id: string) {
        await this.prisma.toothRecord.delete({ where: { id } });
    }
}