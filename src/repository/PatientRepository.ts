import { PrismaClient } from "../generated/prisma/client";
import { PatientMapper } from "../mapper/Patient.mapper";
import { Patient } from "../models/Patient.model";
import { IPatientRepository } from "./interfaces/IPatientRepository";

export class PatientRepository implements IPatientRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async findByName(name: string): Promise<Patient[]> {
    const rows = await this.prisma.patient.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive',
            },
        },
    });
    return rows.map(PatientMapper.toDomain);
}

    async findById(id: string): Promise<Patient | null> {
        const raw = await this.prisma.patient.findUnique({
            where: { id }
        })
        return raw ? PatientMapper.toDomain(raw) : null;
    }

    async save(patient: Patient): Promise<Patient> {
        const raw = await this.prisma.patient.create({
            data: PatientMapper.toPersistence(patient)
        })
        return PatientMapper.toDomain(raw)
    }

    async update(patient: Patient): Promise<Patient> {
        const raw = await this.prisma.patient.update({
            where: { id: patient.getId() },
            data: PatientMapper.toPersistence(patient)
        })
        return PatientMapper.toDomain(raw)
    }
    async delete(id: string): Promise<void> {
        await this.prisma.patient.delete({where : {id}})
    }

}