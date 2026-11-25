// src/mapper/ClinicMapper.ts

import { Clinic as PrismaClinic, Prisma } from '../generated/prisma/client';
import { Clinic } from '../models/Clinic.model';
export class ClinicMapper {
    static toDomain(raw: PrismaClinic): Clinic {
        return Clinic.create({
            id: raw.id,
            name: raw.name,
            phone: raw.phone,
            email: raw.email,
            currency: raw.currency,
            logoUrl: raw.logoUrl,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }

    static toPersistence(clinic: Clinic): Prisma.ClinicUncheckedCreateInput {
        return {
            id: clinic.getId(),
            name: clinic.getName(),
            phone: clinic.getPhone(),
            email: clinic.getEmail(),
            currency: clinic.getCurrency(),
            logoUrl: clinic.getLogoUrl(),
            createdAt: clinic.getCreatedAt(),
            updatedAt: clinic.getUpdatedAt(),
        };
    }
}