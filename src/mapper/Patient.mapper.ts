import { Prisma, Patient as PrismaPatient } from "../generated/prisma/client";
import { Patient, PatientStatus } from "../models/Patient.model";

export class PatientMapper {
    static toDomain(raw: PrismaPatient): Patient {
        return Patient.create({
            id: raw.id,
            clinicId: raw.clinicId,
            name: raw.name,
            initials: raw.initials,
            status: raw.status as PatientStatus,
            balance: raw.balance.toNumber(),
            totalVisits: raw.totalVisit,
            email: raw.email,
            phone: raw.phone,
            address: raw.address,
            dateOfBirth: raw.dateOfBirth,
            lastVisit: raw.lastVisit,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }

    static toPersistence(patient: Patient): Prisma.PatientUncheckedCreateInput {
        return {
            id: patient.getId(),
            clinicId: patient.getClinicId(),
            name: patient.getName(),
            initials: patient.getInitials(),
            status: patient.getStatus(),
            balance: patient.getBalance(),
            totalVisit: patient.getTotalVisits(),
            email: patient.getEmail(),
            phone: patient.getPhone(),
            address: patient.getAddress(),
            dateOfBirth: patient.getDateOfBirth(),
            lastVisit: patient.getLastVisit(),
            createdAt: patient.getCreatedAt(),
            updatedAt: patient.getUpdatedAt(),
        };
    }
}