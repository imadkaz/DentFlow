import { CreateMedialUsecase } from "../usecases/MedicalRecord/CreateMedicalUsecase";
import { UpdateMedicalUsecase } from "../usecases/MedicalRecord/UpdateMedicalUsecase";
import { DeleteMedicalUsecase } from "../usecases/MedicalRecord/DeleteMedicalUsecase";
import { GetMedicalUsecase } from "../usecases/MedicalRecord/getMedicalUsecase";
import { GetPatientMedicalUsecase } from "../usecases/MedicalRecord/GetPatientMedicalUsecase";
import { Request, Response } from "express";
import { MedicalRecord } from "../models/MedicalRecord.model";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";

export class MedicalController {
    constructor(
        private readonly createMedicalUsecase: CreateMedialUsecase,
        private readonly updateMedicalUsecase: UpdateMedicalUsecase,
        private readonly deleteMedicalUsecase: DeleteMedicalUsecase,
        private readonly getMedicalUsecase: GetMedicalUsecase,
        private readonly getPatientMedicalUsecase: GetPatientMedicalUsecase,
    ){}

    CreateMedical = async (req: Request, res: Response) => {
        const input = req.body;
        
        const createMedical = await this.createMedicalUsecase.execute({
            patientId: input.patientId,
            allergies: input.allergies,
            conditions: input.conditions,
            medications: input.medications,
            bloodType: input.bloodType,
            notes: input.notes
        })

        res.status(201).json(this.toResponse(createMedical))
    }

    UpdateMedical = async (req: Request, res: Response) => {
        const input = req.body;
        const id = req.params.id as string;

        if(!id){
            throw new NotFoundError("Medical not found!")
        }

        const updateMedical = await this.updateMedicalUsecase.execute({
            id,
            allergies: input.allergies,
            conditions: input.conditions,
            medications: input.medications,
            bloodType: input.bloodType,
            notes: input.notes,
        })

        res.status(200).json(this.toResponse(updateMedical))
    }

    GetMedical = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        if(!id){
            throw new NotFoundError("Medical not found!")
        }

        const getMedical = await this.getMedicalUsecase.execute(id)

        res.status(200).json(this.toResponse(getMedical))
    }

    GetPatientMedical = async (req: Request, res: Response) => {
        const id = req.params.patientId as string;
        if(!id){
            throw new NotFoundError("Medical not found!")
        }

        const getPatientMedical = await this.getPatientMedicalUsecase.execute(id)

        if (!getPatientMedical) {
            throw new NotFoundError("Medical not found!")
        }

        res.status(200).json(this.toResponse(getPatientMedical))
    }

    DeleteMedical = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        if(!id){
            throw new NotFoundError("Medical not found!")
        }

        await this.deleteMedicalUsecase.execute(id)

        res.status(204).send()
    }

    private toResponse(medical: MedicalRecord){
        return {
            id: medical.getId(),
            patientId: medical.getPatientId(),
            allergies: medical.getAllergies(),
            conditions: medical.getConditions(),
            medications: medical.getMedications(),
            bloodType: medical.getBloodType(),
            notes: medical.getNotes(),
            updatedAt: medical.getUpdatedAt()
        }
    }
}