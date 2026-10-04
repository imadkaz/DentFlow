import { Doctor } from "../../models/Doctor.model";
import { IDoctorRepository } from "../../repository/interfaces/IDoctorRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface UpdateDoctorInput {
    id: string,
    name?: string,
    specialty?: string | null,
    phone?: string | null,
    email?: string | null
}

export class UpdateDoctorUsecase {
    constructor(
        private readonly doctorRepository: IDoctorRepository
    ){}

    async execute(input: UpdateDoctorInput): Promise<Doctor> {
        const existingDoctor = await this.doctorRepository.findById(input.id)
        if(!existingDoctor){
            throw new NotFoundError('Doctor not Found!');
        }

        const updateDoctor = Doctor.create({
            id: existingDoctor.getId(),
            clinicId: existingDoctor.getClinicId(),
            userId: existingDoctor.getUserId(),
            licenseNo: existingDoctor.getLicenseNo(),
            name: input.name !== undefined ? input.name : existingDoctor.getName(),
            createdAt: existingDoctor.getCreatedAt(),
            specialty: input.specialty !== undefined ? input.specialty : existingDoctor.getSpecialty(),
            email: input.email !== undefined ? input.specialty : existingDoctor.getEmail(),
            phone: input.phone !== undefined ? input.phone : existingDoctor.getPhone()
        })

        return await this.doctorRepository.update(updateDoctor);
    }
}