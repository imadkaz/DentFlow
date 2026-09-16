import { PatientStatus, Patient } from "../../models/Patient.model";
import { IClinicRepository } from "../../repository/interfaces/IClinicRepository";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { randomUUID } from "crypto";

export interface CreatePatientInput {
    clinicId: string;
    name: string;
    initials: string;
    status?: PatientStatus;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    dateOfBirth?: Date | null;
}

export class CreatePatientUsecase {
    constructor(
        private readonly patientRepository: IPatientRepository,
        private readonly clinicRepository: IClinicRepository,
    ) {}

    async execute(input: CreatePatientInput): Promise<Patient> {
        const clinic = await this.clinicRepository.findById(input.clinicId);
        if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }

        const patient = Patient.create({
            id: randomUUID(),
            clinicId: input.clinicId,
            name: input.name,
            initials: input.initials,
            status: input.status,
            email: input.email,
            phone: input.phone,
            address: input.address,
            dateOfBirth: input.dateOfBirth,
        });

        return this.patientRepository.save(patient);
    }
}