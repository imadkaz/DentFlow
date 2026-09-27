import { Appointment, AppointmentStatus } from "../../models/Appointment.model";
import { IAppointmentRepository } from "../../repository/interfaces/IAppointmentRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface UpdateAppointmentInput {
    id: string,
    procedure?: string,
    apptDate?: Date,
    apptTime?: Date,
    durationMin?: number,
    status?: AppointmentStatus,
    notes?: string | null,
}

export class UpdateAppointmentUsecase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(input: UpdateAppointmentInput): Promise<Appointment> {
        const existingAppointment = await this.appointmentRepository.findById(input.id)
        if (!existingAppointment) {
            throw new NotFoundError("Appointment not found")
        }

        const update = Appointment.create({
            id: existingAppointment.getId(),
            patientId: existingAppointment.getPatientId(),
            doctorId: existingAppointment.getDoctorId(),
            procedure: input.procedure !== undefined ? input.procedure : existingAppointment.getProcedure(),
            apptDate: input.apptDate !== undefined ? input.apptDate : existingAppointment.getApptDate(),
            apptTime: input.apptTime !== undefined ? input.apptTime : existingAppointment.getApptTime(),
            durationMin: input.durationMin !== undefined ? input.durationMin : existingAppointment.getDurationMin(),
            status: input.status !== undefined ? input.status : existingAppointment.getStatus(),
            notes: input.notes !== undefined ? input.notes : existingAppointment.getNotes(),
            createdAt: existingAppointment.getCreatedAt(),
            updatedAt: new Date()
        })

        return this.appointmentRepository.update(update)
    }
}