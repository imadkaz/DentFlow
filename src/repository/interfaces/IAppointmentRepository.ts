import { Appointment } from "../../models/Appointment.model";
import { IRepository } from "./IRepository";

export interface IAppointmentRepository extends IRepository<Appointment>{
    findByPatientId(patientId: string): Promise<Appointment[]>;
    findByDoctorId(doctorId: string): Promise<Appointment[]>
}