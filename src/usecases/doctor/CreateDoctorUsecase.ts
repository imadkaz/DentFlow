
import { Doctor } from "../../models/Doctor.model";
import { IClinicRepository } from "../../repository/interfaces/IClinicRepository";
import { IDoctorRepository } from "../../repository/interfaces/IDoctorRepository";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { ConflictError } from "../../util/exceptions/http/ConflictError";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { randomUUID } from 'node:crypto'


export interface CreateDoctorInput{
    clinicId: string,
    userId: string,
    name: string,
    licenseNo: string,
    createdAt: Date,
    specialty?: string | null,
    email?: string ,
    phone?: string | null,
}
export class CreateDoctorUsecase{
    constructor(
        private readonly doctorRepository: IDoctorRepository,
        private readonly clinicRepository: IClinicRepository,
        private readonly userRepository  : IUserRepository
    ){}

    async execute(input: CreateDoctorInput): Promise<Doctor> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const clinic = await this.clinicRepository.findById(input.clinicId);
    if (!clinic) {
        throw new NotFoundError('Clinic not found');
    }

    const doctorByL = await this.doctorRepository.findByLicenseNo(input.licenseNo); 
    if (doctorByL) {
        throw new ConflictError('A doctor with this license number already exists');
    }
    
    const doctorByE = input.email
        ? await this.doctorRepository.findByEmail(input.email)
        : null;
    if (input.email && doctorByE ) {
        throw new ConflictError('A doctor with this email already exists');
    }

    const doctor = Doctor.create({
        id: randomUUID(),
        clinicId: input.clinicId,   
        userId: input.userId,       
        name: input.name,
        licenseNo: input.licenseNo,
        specialty: input.specialty,
        email: input.email,
        phone: input.phone,
        createdAt: input.createdAt
    });

    return this.doctorRepository.save(doctor);
}
}