import { Appointment } from "../../models/Appointment.model";
import { IRepository } from "./IRepository";

export interface IAppointmentRepository extends IRepository<Appointment>{
    
}