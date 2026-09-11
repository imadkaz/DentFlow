import { Request, Response } from "express";
import { CreateDoctorUsecase } from "../usecases/doctor/CreateDoctorUsecase";
import { DeleteDoctorUsecase } from "../usecases/doctor/DeleteDoctorUsecase";
import { getDoctorUsecase } from "../usecases/doctor/GetDoctorUsecase";
import { UpdateDoctorUsecase } from "../usecases/doctor/UpdateDoctorUsecase";
import { Doctor } from "../models/Doctor.model";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";

export class DoctorController{

    constructor(
        private readonly createDoctorUsecase: CreateDoctorUsecase,
        private readonly updateDoctorUsecase: UpdateDoctorUsecase,
        private readonly getDoctorUsecase   : getDoctorUsecase,
        private readonly deleteDoctorUsecase: DeleteDoctorUsecase
    ){}

    createDoctor = async (req: Request, res: Response) => {
        const input = req.body;

        const createDoctor = await this.createDoctorUsecase.execute({
            clinicId: input.clinicId,
            userId: input.userId,
            licenseNo: input.licenseNo,
            name: input.name,
            specialty: input.specialty,
            phone: input.phone,
            email: input.email,
            createdAt: input.createdAt
        });

        res.status(201).json(this.toResponse(createDoctor))
    }

    updateDoctor = async (req: Request , res: Response) => {
        const input = req.body;
        const id    = req.params.id;

        if(!id){
            throw new NotFoundError("Doctor not Found");
        }
        const updateDoctor = await this.updateDoctorUsecase.execute({
            id: id as string,
            name: input.name,
            specialty: input.specialty,
            phone: input.phone,
            email: input.email,
        })

        res.status(200).json(this.toResponse(updateDoctor))
    }

    getDoctorById = async (req: Request, res: Response) => {
        const id  = req.params.id;
        if(!id){
            res.status(400).json({error: 'Doctor Id is required'})
            throw new NotFoundError("Doctor not found!")
        }

        const getDoctor = await this.getDoctorUsecase.executeById(id as string);

        res.status(200).json(this.toResponse(getDoctor));
    }
    getDoctorByEmail = async (req: Request, res: Response) => {
        const email  = req.params.email;
        if(!email){
            res.status(400).json({error: 'Doctor email is required'})
            throw new NotFoundError("Doctor not found!")
        }

        const getDoctor = await this.getDoctorUsecase.executeByEmail(email as string);

        res.status(200).json(this.toResponse(getDoctor));
    }

    getDoctorByLicenseNo = async (req: Request, res: Response) => {
        const LicenseNo  = req.params.licenseNo;
        if(!LicenseNo){
            res.status(400).json({error: 'Doctor Id is required'})
            throw new NotFoundError("Doctor not found!")
        }

        const getDoctor = await this.getDoctorUsecase.executeByLicense(LicenseNo as string);

        res.status(200).json(this.toResponse(getDoctor));
    }

    deleteDoctor = async(req: Request, res: Response) => {

        const id = req.params.id;
        await this.deleteDoctorUsecase.execute(id as string)
        
        res.status(204).send();
    }

    private toResponse(doctor: Doctor) {
        return {
            id: doctor.getId(),
            clinicId: doctor.getClinicId(),
            userId: doctor.getUserId(),
            name: doctor.getName(),
            licenseNo: doctor.getLicenseNo(),
            specialty: doctor.getSpecialty(),
            phone: doctor.getPhone(),
            email: doctor.getEmail(),
            createdAt: doctor.getCreatedAt()
        }
    }
}