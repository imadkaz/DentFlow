import { Appointment, AppointmentStatus } from "../../models/Appointment.model"
import { AppointmentRepository } from "../../repository/AppointmentRepository";
import { DoctorRepository } from "../../repository/DoctorRepository"
import { PatientRepository } from "../../repository/PatientRepository"
import { randomUUID } from "crypto";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { ConflictError } from "../../util/exceptions/http/ConflictError";

export interface CreateProps {
    patientId: string,
    doctorId: string,
    procedure: string,
    apptDate: Date,
    apptTime: Date,
    durationMin: number,
    status?: AppointmentStatus
    notes?: string | null,
}
function combineDateAndTime(date: Date, time: Date): Date {
    return new Date(Date.UTC(
        date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(),
    ));
}

export class CreateAppointmentUsecase {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly patientRepository: PatientRepository,
        private readonly doctorRepository: DoctorRepository
    ) { }


    async execute(input: CreateProps): Promise<Appointment> {
        const patient = await this.patientRepository.findById(input.patientId)
        if (!patient) {
            throw new NotFoundError("Patient not found")
        }
        const doctor = await this.doctorRepository.findById(input.doctorId)
        if (!doctor) {
            throw new NotFoundError("Doctor not found")
        }

        const newStart = combineDateAndTime(input.apptDate, input.apptTime);
        const newEnd = new Date(newStart.getTime() + (input.durationMin ?? 30) * 60000);

        const sameDayAppointments = await this.appointmentRepository.findByDoctorAndDate(input.doctorId, input.apptDate);

        const hasOverlap = sameDayAppointments.some((existing) => {

            if (existing.getStatus() === AppointmentStatus.CANCELLED) return false;

            const existingStart = combineDateAndTime(existing.getApptDate(), existing.getApptTime());
            const existingEnd = new Date(existingStart.getTime() + existing.getDurationMin() * 60000);
            
            return newStart < existingEnd && existingStart < newEnd;
        });
        if (hasOverlap) {
            throw new ConflictError('Doctor already has an overlapping appointment at this time');
        }
        
        const appointment = Appointment.create({
            id: randomUUID(),
            patientId: input.patientId,
            doctorId: input.doctorId,
            procedure: input.procedure,
            apptDate: input.apptDate,
            apptTime: input.apptTime,
            durationMin: input.durationMin,
            status: input.status,
            notes: input.notes,
        })
        return await this.appointmentRepository.save(appointment)
    }
}

