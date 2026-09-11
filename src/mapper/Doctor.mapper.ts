
import { Doctor as PrismaDoctor, Prisma } from "../generated/prisma/client";
import { Doctor } from "../models/Doctor.model";


export class DoctorMapper {
    static toDomain(raw: PrismaDoctor): Doctor {
        return Doctor.create ({
            id: raw.id,
            clinicId: raw.clinicId,
            userId: raw.userId,
            name: raw.name,
            licenseNo: raw.licenseNo,
            createdAt: raw.createdAt,
            specialty: raw.specialty,
            email: raw.email,
            phone: raw.phone,
        })
    }

    static toPersistence(doctor: Doctor): Prisma.DoctorUncheckedCreateInput{
        return {
            id: doctor.getId(),
            clinicId: doctor.getClinicId(),
            userId: doctor.getUserId(),
            name: doctor.getName(),
            licenseNo: doctor.getLicenseNo(),
            createdAt: doctor.getCreatedAt(),
            specialty: doctor.getSpecialty(),
            email: doctor.getEmail(),
            phone: doctor.getPhone()
        }
    }
}