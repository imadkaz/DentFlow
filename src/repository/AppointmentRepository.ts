import { Prisma, PrismaClient } from "../generated/prisma/client";
import { AppointmentMapper } from "../mapper/Appointment.mapper";
import { Appointment } from "../models/Appointment.model";
import { ConflictError } from "../util/exceptions/http/ConflictError";
import { IAppointmentRepository } from "./interfaces/IAppointmentRepository";

export class AppointmentRepository implements IAppointmentRepository {

    constructor(private readonly prisma: PrismaClient) { }


    async findByDoctorAndDate(doctorId: string, apptDate: Date): Promise<Appointment[]> {
    const startOfDay = new Date(Date.UTC(apptDate.getUTCFullYear(), apptDate.getUTCMonth(), apptDate.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(apptDate.getUTCFullYear(), apptDate.getUTCMonth(), apptDate.getUTCDate(), 23, 59, 59));
    const rows = await this.prisma.appointment.findMany({
        where: { doctorId, apptDate: { gte: startOfDay, lte: endOfDay } },
    });
    return rows.map(AppointmentMapper.toDomain);
}

    async findById(id: string): Promise<Appointment | null> {
        const raw = await this.prisma.appointment.findUnique({ where: { id } })

        return raw ? AppointmentMapper.toDomain(raw) : null;
    }

    async save(entity: Appointment): Promise<Appointment> {
        try {
            const raw = await this.prisma.appointment.create({
                data: AppointmentMapper.toPersistence(entity),
            });
            return AppointmentMapper.toDomain(raw);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictError('An appointment already exists for this doctor at this exact date and time');
            }
            throw error;
        }
    }

    async update(entity: Appointment): Promise<Appointment> {
        const raw = await this.prisma.appointment.update({
            where: { id: entity.getId() },
            data: AppointmentMapper.toPersistence(entity)
        })
        return AppointmentMapper.toDomain(raw)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.appointment.delete({ where: { id } })
    }

    async findByPatientId(patientId: string): Promise<Appointment[]> {
        const rows = await this.prisma.appointment.findMany({
            where: { patientId },
            orderBy: [{ apptDate: 'asc' }, { apptTime: 'asc' }]
        })

        return rows.map(AppointmentMapper.toDomain)
    }

    async findByDoctorId(doctorId: string): Promise<Appointment[]> {
        const rows = await this.prisma.appointment.findMany({
            where: { doctorId },
            orderBy: [ { apptDate: 'asc' }, { apptTime: 'asc' } ]
        })

        return rows.map(AppointmentMapper.toDomain)
    }
}