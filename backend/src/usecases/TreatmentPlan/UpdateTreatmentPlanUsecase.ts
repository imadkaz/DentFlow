import { TreatmentPlan, PlanStatus } from "../../models/TreatmentPlan.model";
import { TreatmentPlanRepository } from "../../repository/TreatmentPlanRepository";
import { ConflictError } from "../../util/exceptions/http/ConflictError";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface UpdateTreatmentPlanProps {
	id: string;
	treatmentType?: string,
    startDate?: Date,
    endDate?: Date,
    totalCost?: number,
    status?: PlanStatus,
    nextApptAt?: Date 
}

export class UpdateTreatmentPlanUsecase {
	constructor(
		private readonly treatmentPlanRepository: TreatmentPlanRepository
	) { }

	async execute(input: UpdateTreatmentPlanProps): Promise<TreatmentPlan> {
		const existingTreatmentPlan = await this.treatmentPlanRepository.findById(input.id);
        if (!existingTreatmentPlan) throw new NotFoundError('Treatment plan not found');

        const newStatus = input.status !== undefined ? input.status : existingTreatmentPlan.getStatus();
        if (newStatus === PlanStatus.ACTIVE && existingTreatmentPlan.getStatus() !== PlanStatus.ACTIVE) {
            const existingActive = await this.treatmentPlanRepository.findActiveByPatient(existingTreatmentPlan.getPatientId());
            if (existingActive && existingActive.getId() !== existingTreatmentPlan.getId()) {
                throw new ConflictError('Patient already has an active treatment plan');
            }
        }

		const treatmentPlan = TreatmentPlan.create({
            id: existingTreatmentPlan.getId(),
            patientId: existingTreatmentPlan.getPatientId(),
            doctorId: existingTreatmentPlan.getDoctorId(),
            treatmentType: input.treatmentType !== undefined ? input.treatmentType : existingTreatmentPlan.getTreatmentType(),
            startDate: input.startDate !== undefined ? input.startDate : existingTreatmentPlan.getStartDate(),
            endDate: input.endDate !== undefined ? input.endDate : existingTreatmentPlan.getEndDate(),
            status: input.status !== undefined ? input.status : existingTreatmentPlan.getStatus(),
            totalCost: input.totalCost !== undefined ? input.totalCost : existingTreatmentPlan.getTotalCost(),
            paidAmount: existingTreatmentPlan.getPaidAmount(),
            createdAt: existingTreatmentPlan.getCreatedAt(),
            updatedAt: new Date(),
        });

		return await this.treatmentPlanRepository.update(treatmentPlan);
	}
}
