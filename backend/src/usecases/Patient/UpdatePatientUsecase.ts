import { Patient, PatientStatus } from "../../models/Patient.model";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface UpdatePatientProps {
    id: string;
    name?: string;
    initials?: string;
    status?: PatientStatus;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    dateOfBirth?: Date | null;
}

export class UpdatePatientUsecase {
    constructor(
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(input: UpdatePatientProps): Promise<Patient> {
        const existingPatient = await this.patientRepository.findById(input.id)
        if (!existingPatient) {
            throw new NotFoundError("Patient not found!")
        }

        const patient = Patient.create({
            id: existingPatient.getId(),
            clinicId: existingPatient.getClinicId(),
            name: input.name !== undefined ? input.name : existingPatient.getName(),
            initials: input.initials !== undefined ? input.initials : existingPatient.getInitials(),
            status: input.status !== undefined ? input.status : existingPatient.getStatus(),
            email: input.email !== undefined ? input.email : existingPatient.getEmail(),
            phone: input.phone !== undefined ? input.phone : existingPatient.getPhone(),
            address: input.address !== undefined ? input.address : existingPatient.getAddress(),
            dateOfBirth: input.dateOfBirth !== undefined ? input.dateOfBirth : existingPatient.getDateOfBirth(),
            balance: existingPatient.getBalance(),
            totalVisits: existingPatient.getTotalVisits(),
            lastVisit: existingPatient.getLastVisit(),
            createdAt: existingPatient.getCreatedAt(),
            updatedAt: new Date(),
        });

        return await this.patientRepository.update(patient)
    }
}