// src/repository/ClinicRepository.ts

import { PrismaClient } from '../generated/prisma/client';
import { IClinicRepository } from './interfaces/IClinicRepository';
import { Clinic } from '../models/Clinic.model';
import { ClinicMapper } from '../mapper/Clinic.mapper';

export class ClinicRepository implements IClinicRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Clinic | null> {
        const raw = await this.prisma.clinic.findUnique({ where: { id } });
        return raw ? ClinicMapper.toDomain(raw) : null;
    }

    async findByEmail(email: string): Promise<Clinic | null> {
        const raw = await this.prisma.clinic.findUnique({ where: { email } });
        return raw ? ClinicMapper.toDomain(raw) : null;
    }

    async save(clinic: Clinic): Promise<Clinic> {
        const raw = await this.prisma.clinic.create({
            data: ClinicMapper.toPersistence(clinic),
        });
        return ClinicMapper.toDomain(raw);
    }

    async update(clinic: Clinic): Promise<Clinic> {
        const raw = await this.prisma.clinic.update({
            where: { id: clinic.getId() },
            data: ClinicMapper.toPersistence(clinic),
        });
        return ClinicMapper.toDomain(raw);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.clinic.delete({ where: { id } });
    }
}