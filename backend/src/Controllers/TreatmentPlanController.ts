import { Request, Response } from "express";
import { CreateTreatmentPlanUsecase } from "../usecases/TreatmentPlan/CreateTreatmentPlanUsecase";
import { UpdateTreatmentPlanUsecase } from "../usecases/TreatmentPlan/UpdateTreatmentPlanUsecase";
import { GetTreatmentPlanUsecase } from "../usecases/TreatmentPlan/GetTreatmentPlanUsecase";
import { DeleteTreatmentPlanUsecase } from "../usecases/TreatmentPlan/DeleteTreatmentPlanUsecase";
import { TreatmentPlan } from "../models/TreatmentPlan.model";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";
import { GetPatientTreatmentsUsecase } from "../usecases/TreatmentPlan/GetPatientTreatmentUsecase";

export class TreatmentPlanController {
    constructor(
        private readonly createTreatmentPlanUsecase: CreateTreatmentPlanUsecase,
        private readonly updateTreatmentPlanUsecase: UpdateTreatmentPlanUsecase,
        private readonly getTreatmentPlanUsecase: GetTreatmentPlanUsecase,
        private readonly deleteTreatmentPlanUsecase: DeleteTreatmentPlanUsecase,
        private readonly getPatientTreatmentUsecase: GetPatientTreatmentsUsecase
    ){}

    createTreatment = async ( req: Request, res: Response ) => {
        const input = req.body;

        const treatment = await this.createTreatmentPlanUsecase.execute({
            patientId: input.patientId,
            doctorId: input.doctorId,
            treatmentType: input.treatmentType,
            startDate: input.startDate,
            endDate: input.endDate,
            totalCost: input.totalCost,
            status: input.status,
            nextApptAt: input.nextApptAt,
        })

        res.status(201).json(this.toResponse(treatment))
    }

    updateTreatment = async ( req: Request, res: Response ) => {
        const id = req.params.id as string;
        const input = req.body;
        
        if(!id){
            throw new NotFoundError("Treatment not found!")
        }

        const treatment = await this.updateTreatmentPlanUsecase.execute({
            id,
            treatmentType: input.treatmentType,
            startDate: input.startDate,
            endDate: input.endDate,
            totalCost: input.totalCost,
            status: input.status,
            nextApptAt: input.nextApptAt,
        }) 

        res.status(200).json(this.toResponse(treatment))
    }

    getTreatment = async ( req: Request, res: Response ) => {
        const id = req.params.id as string;
        if(!id){
            throw new NotFoundError("Treatment not found!")
        }
        const treatment = await this.getTreatmentPlanUsecase.execute(id)
        res.status(200).json(this.toResponse(treatment))
    }
    getPatientTreatments = async (req: Request, res: Response) => {   
    const plans = await this.getPatientTreatmentUsecase.execute(req.params.patientId as string);
    res.status(200).json(plans.map(p => this.toResponse(p)));
};

    deleteTreatment = async ( req: Request, res: Response ) => {
        const id = req.params.id as string

        if(!id){
            throw new NotFoundError("Treatment not found!")
        }

        await this.deleteTreatmentPlanUsecase.execute(id)

        res.status(204).send()
    }

    private toResponse(treatmentPlan: TreatmentPlan){
        return {
            id: treatmentPlan.getId(),
            patientId: treatmentPlan.getPatientId(),
            doctorId: treatmentPlan.getDoctorId(),
            treatmentType: treatmentPlan.getTreatmentType(),
            startDate: treatmentPlan.getStartDate(),
            endDate: treatmentPlan.getEndDate(),
            totalCost: treatmentPlan.getTotalCost(),
            paidAmount: treatmentPlan.getPaidAmount(),
            status: treatmentPlan.getStatus(),
            nextApptAt: treatmentPlan.getNextAppAt(), 
        }
    }
}