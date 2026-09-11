
import { PrismaClient } from "../generated/prisma/client";
import { DoctorMapper } from "../mapper/Doctor.mapper";
import { Doctor } from "../models/Doctor.model";
import { IDoctorRepository } from "./interfaces/IDoctorRepository";




export class DoctorRepository implements IDoctorRepository{
    constructor(private readonly prisma: PrismaClient){}

    async save(doctor: Doctor): Promise<Doctor>{
        const raw = await this.prisma.doctor.create({
            data: DoctorMapper.toPersistence(doctor)
        })
        return DoctorMapper.toDomain(raw)
    }

    async update(doctor: Doctor): Promise<Doctor> {
        const raw = await this.prisma.doctor.update({
            where: {id: doctor.getId()},
            data: DoctorMapper.toPersistence(doctor)
        })

        return DoctorMapper.toDomain(raw)
    }

    async findByEmail(email: string) : Promise<Doctor | null>{
        const raw = await this.prisma.doctor.findUnique({
            where: {email}
        })

        return raw ? DoctorMapper.toDomain(raw) : null;
    }

    async findById (id: string) : Promise<Doctor | null> {
        const raw = await this.prisma.doctor.findUnique({
            where: {id}
        })

        return raw ? DoctorMapper.toDomain(raw) : null ;
    }
    
    async findByLicenseNo(licenseNo: string) : Promise<Doctor | null> {
        const raw = await this.prisma.doctor.findUnique({
            where: {licenseNo}
        })

        return raw ? DoctorMapper.toDomain(raw) : null;
    }

    async findByUserId(userId: string) : Promise<Doctor | null> {
        const raw = await this.prisma.doctor.findUnique({
            where: {userId}
        })

        return raw ? DoctorMapper.toDomain(raw) : null;
    }

    async delete(id: string) : Promise<void> {
        await this.prisma.doctor.delete({ where: {id} });
    }
}
