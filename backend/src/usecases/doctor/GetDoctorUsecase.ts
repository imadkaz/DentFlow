import { Doctor } from "../../models/Doctor.model";
import { IDoctorRepository } from "../../repository/interfaces/IDoctorRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class getDoctorUsecase{
    constructor(
        private readonly doctorRepository : IDoctorRepository
    ){}

    async executeById(id: string) : Promise<Doctor> {
        const doctor = await this.doctorRepository.findById(id)
        if(!doctor){
            throw new NotFoundError("Doctor Not found!");
        }

        return doctor
    }

    async executeByEmail(email: string) : Promise<Doctor> {
        const doctor = await this.doctorRepository.findByEmail(email)
        if(!doctor){
            throw new NotFoundError("Doctor Not found!");
        }

        return doctor
    }

    async executeByLicense(license: string) : Promise<Doctor> {
        const doctor = await this.doctorRepository.findById(license)
        if(!doctor){
            throw new NotFoundError("Doctor Not found!");
        }

        return doctor
    }
}