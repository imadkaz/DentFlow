import { AppointmentRepository } from "../../repository/AppointmentRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class DeleteAppointmentUsecase {
    constructor(
        private readonly appointmentRepository: AppointmentRepository
    ){}

    async execute(id: string): Promise<void>{
                const appointment = await this.appointmentRepository.findById(id);
                if (!appointment) {
                    throw new NotFoundError('Patient not found');
                }
                await this.appointmentRepository.delete(id);
    }
}