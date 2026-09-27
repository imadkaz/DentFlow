import { PrismaClient } from "../generated/prisma/client";
import { AppointmentMapper } from "../mapper/Appointment.mapper";
import { Appointment } from "../models/Appointment.model";
import { IAppointmentRepository } from "./interfaces/IAppointmentRepository";

export class AppointmentRepository implements IAppointmentRepository {

    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Appointment | null> {
        const raw = await this.prisma.appointment.findUnique({ where: { id } })

        return raw ? AppointmentMapper.toDomain(raw) : null;
    }

    async save(entity: Appointment): Promise<Appointment> {
        const raw = await this.prisma.appointment.create({
            data: AppointmentMapper.toPersistence(entity)
        })
        return AppointmentMapper.toDomain(raw)
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

}