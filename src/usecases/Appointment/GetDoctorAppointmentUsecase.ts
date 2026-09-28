import { Appointment } from "../../models/Appointment.model";
import { IAppointmentRepository } from "../../repository/interfaces/IAppointmentRepository";
import { IDoctorRepository } from "../../repository/interfaces/IDoctorRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetDoctorAppointmentsUsecase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly doctorRepository: IDoctorRepository,
    ) {}

    async execute(doctorId: string): Promise<Appointment[]> {
        const doctor = await this.doctorRepository.findById(doctorId);
        if (!doctor) {
            throw new NotFoundError('doctor not found');
        }
        return this.appointmentRepository.findByDoctorId(doctorId);
    }
}