import { PlanStatus, TreatmentPlan } from "../../models/TreatmentPlan.model";
import { IDoctorRepository } from "../../repository/interfaces/IDoctorRepository";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { ITreatmentPlanRepository } from "../../repository/interfaces/ITreatmentPlanRepository";
import { ConflictError } from "../../util/exceptions/http/ConflictError";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { randomUUID } from 'crypto'

export interface CreateTreatmentPlanInput {
    patientId: string,
    doctorId: string,
    treatmentType: string,
    startDate: Date,
    endDate?: Date,
    totalCost: number,
    status?: PlanStatus,
    nextApptAt?: Date 
}
export class CreateTreatmentPlanUsecase {
    constructor(
        private readonly treatmentPlanRepository: ITreatmentPlanRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(input: CreateTreatmentPlanInput): Promise<TreatmentPlan> {
        const patient = await this.patientRepository.findById(input.patientId)
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }

        const doctor = await this.doctorRepository.findById(input.doctorId)
        if (!doctor) {
            throw new NotFoundError('Doctor not found');
        }

        const desiredStatus = input.status ?? PlanStatus.PENDING;
        if (desiredStatus === PlanStatus.ACTIVE) {
            const existingActive = await this.treatmentPlanRepository.findActiveByPatient(input.patientId);
            if (existingActive) {
                throw new ConflictError('Patient already has an active treatment plan');
            }
        }

        const treatmentPlan = TreatmentPlan.create({
            id: randomUUID(),
            patientId: input.patientId,
            doctorId: input.doctorId,
            treatmentType: input.treatmentType,
            startDate: input.startDate,
            endDate: input.endDate,
            totalCost: input.totalCost,
            status: input.status,
            nextApptAt: input.nextApptAt
        })

        return await this.treatmentPlanRepository.save(treatmentPlan)

    }
}