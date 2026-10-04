import { Appointment, AppointmentStatus } from "../models/Appointment.model";
import { Prisma, Appointment as prismaAppointment } from "../generated/prisma/client"
export class AppointmentMapper {
    static toDomain(raw: prismaAppointment): Appointment{
        return Appointment.create({
            id: raw.id,
            patientId: raw.patientId,
            doctorId: raw.doctorId,
            procedure: raw.procedure,
            apptDate: raw.apptDate,
            apptTime: raw.apptTime,
            durationMin: raw.durationMin,
            status: raw.status as AppointmentStatus,
            notes: raw.notes ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        });
    }
    static toPersistence(appointment: Appointment) : Prisma.AppointmentUncheckedCreateInput{
        return {
            id: appointment.getId(),
            patientId: appointment.getPatientId(),
            doctorId: appointment.getDoctorId(),
            procedure: appointment.getProcedure(),
            apptDate: appointment.getApptDate(),
            apptTime: appointment.getApptTime(),
            durationMin: appointment.getDurationMin(),
            status: appointment.getStatus(),
            notes: appointment.getNotes() ,
            createdAt: appointment.getCreatedAt(),
            updatedAt: appointment.getUpdatedAt()
        }
    }
}