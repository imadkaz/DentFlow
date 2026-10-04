import { Appointment } from "../../models/Appointment.model";
import { IAppointmentRepository } from "../../repository/interfaces/IAppointmentRepository";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

// usecases/Appointment/GetPatientAppointmentsUsecase.ts
export class GetPatientAppointmentsUsecase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly patientRepository: IPatientRepository,
    ) {}

    async execute(patientId: string): Promise<Appointment[]> {
        const patient = await this.patientRepository.findById(patientId);
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }
        return this.appointmentRepository.findByPatientId(patientId);
    }
}