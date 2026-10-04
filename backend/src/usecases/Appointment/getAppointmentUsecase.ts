import { Appointment } from "../../models/Appointment.model";
import { AppointmentRepository } from "../../repository/AppointmentRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetAppointmentUsecase {
    constructor(
        private readonly appointmentRepository: AppointmentRepository
    ){}

    async execute(id: string): Promise<Appointment>{
        const appointment = await this.appointmentRepository.findById(id)
        if(!appointment){
            throw new NotFoundError("there is not Appointment with this id: " + id)
        }

        return appointment
    }
}