import { CreateClinicUsecase } from "../usecases/clinic/CreateClinicUsecase";
import { DeleteClinicUsecase } from "../usecases/clinic/DeleteClinicUsecase";
import { GetClinicUsecase } from "../usecases/clinic/GetClinicUsecase";
import { UpdateClinicUsecase } from "../usecases/clinic/UpdateClinicUsecase";
import { Request, Response } from "express";
import { Clinic } from "../models/Clinic.model";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";

export class ClinicControllers {

    constructor(
        private readonly getClinicUsecase: GetClinicUsecase,
        private readonly deleteClinicUsecase: DeleteClinicUsecase,
        private readonly updateClinicUsecase: UpdateClinicUsecase,
        private readonly createClinicUsecase: CreateClinicUsecase
    ) { }

    createClinic = async (req: Request, res: Response) => {
        const input = req.body;
        const clinic = await this.createClinicUsecase.execute({
            name: input.name,
            phone: input.phone,
            email: input.email,
            logoUrl: input.logoUrl,
        });
        res.json(this.toResponse(clinic));
    }
    getClinicById = async (req: Request, res: Response) => {
        const id = req.params.id;

        if(!id){
            throw new NotFoundError("Doctor not found!")
        }
        const clinic = await this.getClinicUsecase.executeByID(id as string);
        res.status(200).json(this.toResponse(clinic));

    }
    getClinicByEmail = async (req: Request, res: Response) => {
        const email = req.params.email;

        if(!email){
            throw new NotFoundError("Doctor not found!")
        }
        const clinic = await this.getClinicUsecase.executeByEmail(email as string);
        res.status(200).json(this.toResponse(clinic));

    }
    deleteClinic = async (req: Request, res: Response) => {
        const id = req.params.id;

        if(!id){
            res.status(400).json({error: 'Clinic Id is required'})
            throw new NotFoundError("Doctor not found!")
        }
        await this.deleteClinicUsecase.execute(id as string);
        res.status(204).send();

    }
    updateClinic = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: 'Clinic ID is required' });
            return;
        }
        const clinic = await this.updateClinicUsecase.execute({
            id: id as string,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            logoUrl: req.body.logoUrl,
        });
        res.status(200).json(this.toResponse(clinic));

    }

    private toResponse(clinic: Clinic) {
        return {
            id: clinic.getId(),
            name: clinic.getName(),
            phone: clinic.getPhone(),
            email: clinic.getEmail(),
            logoUrl: clinic.getLogoUrl(),
            createdAt: clinic.getCreatedAt(),
            updatedAt: clinic.getUpdatedAt(),
        };
    }
    private handleError(res: Response, err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (message.includes('not found')) {
            res.status(404).json({ error: message });
        } else if (message.includes('already exists')) {
            res.status(409).json({ error: message });
        } else {
            res.status(400).json({ error: message });
        }
    }
}