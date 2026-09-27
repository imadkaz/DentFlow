import { Appointment, AppointmentStatus } from "../../models/Appointment.model"
import { AppointmentRepository } from "../../repository/AppointmentRepository";
import { DoctorRepository } from "../../repository/DoctorRepository"
import { PatientRepository } from "../../repository/PatientRepository"
import { ConflictError } from "../../util/exceptions/http/ConflictError"
import { randomUUID } from "crypto";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

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

