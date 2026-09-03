import { Clinic } from "../models/Clinic.model";
import { IClinicRepository } from "../repository/IClinicRepository";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";

export interface UpdateClinicInput {
    id: string;
    name?: string;
    phone?: string | null;
    email?: string | null;
    logoUrl?: string | null;
}

export class UpdateClinicUsecase {
    constructor(private readonly clinicRepository: IClinicRepository) { }

    async execute(input: UpdateClinicInput): Promise<Clinic> {
        const existingClinic = await this.clinicRepository.findById(input.id);
        if (!existingClinic) {
            throw new NotFoundError('Clinic not found');
        }
        const updatedClinic = Clinic.create({
            id: existingClinic.getId(),
            name: input.name !== undefined ? input.name : existingClinic.getName(),
            phone:
                input.phone !== undefined ? input.phone : existingClinic.getPhone(),
            email:
                input.email !== undefined ? input.email : existingClinic.getEmail(),
            logoUrl:
                input.logoUrl !== undefined
                    ? input.logoUrl
                    : existingClinic.getLogoUrl(),
            createdAt: existingClinic.getCreatedAt(),
            updatedAt: new Date(),
        });
        return await this.clinicRepository.update(updatedClinic);
    }
}
