import { Request, Response } from "express";
import { CreateAppointmentUsecase } from "../usecases/Appointment/CreateAppointmentUsecase";
import { DeleteAppointmentUsecase } from "../usecases/Appointment/DeleteAppointmentUsecase";
import { GetAppointmentUsecase } from "../usecases/Appointment/getAppointmentUsecase";
import { UpdateAppointmentUsecase } from "../usecases/Appointment/UpdateAppointmentUsecase";
import { randomUUID } from "crypto"
import { Appointment } from "../models/Appointment.model";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";
export class AppointmentController{
    
    constructor(
        private readonly createAppointmentUsecase: CreateAppointmentUsecase,
        private readonly updateAppointmentUsecase: UpdateAppointmentUsecase,
        private readonly getAppointmentUsecase   : GetAppointmentUsecase,
        private readonly deleteAppointmentUsecase: DeleteAppointmentUsecase
    ){}

    createAppointment = async (req: Request, res: Response) => {
        const input   = await req.body
        
        const create  = await this.createAppointmentUsecase.execute({
            patientId: input.patientId,
            doctorId : input.doctorId,
            procedure: input.procedure,
            apptDate : input.apptDate,
            apptTime : input.apptTime,
            durationMin: input.durationMin,
            status: input.status,
            notes: input.notes
        })

        res.status(201).json(this.toResponse(create))
    }

    updateAppointment = async (req: Request, res: Response) => {
        const id = req.params.id as string
        const input = req.body

        if(!id){
            throw new NotFoundError("Appointment Not Found")
        }

        const update = await this.updateAppointmentUsecase.execute({
            id,
            procedure: input.procedure,
            apptDate : input.apptDate,
            apptTime : input.apptTime,
            durationMin: input.durationMin,
            status: input.status,
            notes: input.notes
        })

        res.status(200  ).json(this.toResponse(update))
    }

    getAppointmentById = async (req: Request, res: Response) => {
        const id = req.params.id as string

        if(!id){
            throw new NotFoundError("Appointment Not Found")
        }

        const getAppointment = await this.getAppointmentUsecase.execute(id as string)

        res.status(200).json(this.toResponse(getAppointment))
    }

    deleteAppointment = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if(!id){
            throw new NotFoundError("Appointment Not Found")
        }

        await this.deleteAppointmentUsecase.execute(id as string)

        res.status(204).send()
    }

    private toResponse(appointment: Appointment){
        return{
            id: appointment.getId(),
            patientId: appointment.getPatientId(),
            doctorId: appointment.getDoctorId(),
            procedure: appointment.getProcedure(),
            apptDate: appointment.getApptDate(),
            apptTime: appointment.getApptTime(),
            durationMin: appointment.getDurationMin(),
            status: appointment.getStatus(),
            notes: appointment.getNotes(),
            createdAt: appointment.getCreatedAt()
        } 
    }
}