import { Patient } from "../models/Patient.model";
import { CreatePatientUsecase } from "../usecases/Patient/CreatePatientUsecase";
import { DeletePatientUsecase } from "../usecases/Patient/DeletepatientUsecase";
import { GetPatientUsecase } from "../usecases/Patient/GetPatientUsecase";
import { UpdatePatientUsecase } from "../usecases/Patient/UpdatePatientUsecase";
import { Request, Response } from "express";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";
export class PatientController {

    constructor(
        private readonly createPatientUsecase: CreatePatientUsecase,
        private readonly updatePatientUsecase: UpdatePatientUsecase,
        private readonly getPatientUsecase: GetPatientUsecase,
        private readonly deletePatientUsecase: DeletePatientUsecase
    ){}

    createPatient = async (req: Request, res: Response) => {
        const input = await req.body;

        const patient = await this.createPatientUsecase.execute({
            clinicId: input.clinicId,
            name: input.name,
            initials: input.initials,
            status: input.status,
            email: input.email,
            phone: input.phone,
            address: input.address,
            dateOfBirth: input.dateOfBirth,
        })

        res.status(201).json(this.toResponse(patient))
    }

    updatePatient = async (req: Request, res: Response) => {
        const input = await req.body;
        const id    = req.params.id;

        if(!id){
            throw new NotFoundError("Patient not found!")
        }

        const updatePatient = await this.updatePatientUsecase.execute({
            id: id as string,
            name: input.name,
            initials: input.initials,
            status: input.status,
            email: input.email,
            phone: input.phone,
            address: input.address,
            dateOfBirth: input.dateOfBirth,
        })

        res.status(200).json(this.toResponse(updatePatient))
    }

    getPatientById = async (req: Request, res: Response) => {
        const id = req.params.id;

        if(!id){
            throw new NotFoundError("Patient not found!")
        }

        const getPatient = await this.getPatientUsecase.executeById(id as string)
        
        res.status(200).json(this.toResponse(getPatient))
    }

    getPatientByName = async (req: Request, res: Response) => {
        const name = req.params.name;
        if(!name){
            throw new NotFoundError("Patient not found!")
        }

        const getPatient = await this.getPatientUsecase.executeByName(name as string)

        res.status(200).json(getPatient.map(patient => this.toResponse(patient)))
    }

    deletePatient = async (req: Request, res: Response) => {
        const id = req.params.id;
        if(!id){
            throw new NotFoundError("Patient not found!")
        }
        await this.deletePatientUsecase.execute(id as string)

        res.status(204).send()
        
    }

    private toResponse(patient: Patient) {
        return {
            id: patient.getId(),
            clinicId: patient.getClinicId(),
            name: patient.getName(),
            initials: patient.getInitials(),
            status: patient.getStatus(),
            phone: patient.getPhone(),
            email: patient.getEmail(),
            address: patient.getAddress(),
            dateOfBirth: patient.getDateOfBirth(),
            createdAt: patient.getCreatedAt()
        }
    }

}