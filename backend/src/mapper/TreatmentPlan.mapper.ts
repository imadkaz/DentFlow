import {  Prisma, TreatmentPlan as PrismaTreatmentPlan} from '../generated/prisma/client'
import { PlanStatus, TreatmentPlan } from '../models/TreatmentPlan.model'

export class TreatmentPlanMapper {
    static toDomain(raw: PrismaTreatmentPlan): TreatmentPlan{
        return TreatmentPlan.create({
            id: raw.id,
            patientId: raw.patientId,
            doctorId: raw.doctorId,
            treatmentType: raw.treatmentType,
            startDate: raw.startDate,
            endDate: raw.endDate,
            totalCost: raw.totalCost.toNumber(),
            paidAmount: raw.paidAmount.toNumber(),
            status: raw.status as PlanStatus,
            nextApptAt: raw.nextApptAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        })
    }

    static toPersistence(treatmentPlan: TreatmentPlan): Prisma.TreatmentPlanUncheckedCreateInput{
        return {
            id: treatmentPlan.getId(),
            patientId: treatmentPlan.getPatientId(),
            doctorId: treatmentPlan.getDoctorId(),
            treatmentType: treatmentPlan.getTreatmentType(),
            startDate: treatmentPlan.getStartDate(),
            endDate: treatmentPlan.getEndDate(),
            totalCost: treatmentPlan.getTotalCost(),
            paidAmount: treatmentPlan.getPaidAmount(),
            status: treatmentPlan.getStatus(),
            nextApptAt: treatmentPlan.getNextAppAt(),
            createdAt: treatmentPlan.getCreatedAt(),
            updatedAt: treatmentPlan.getUpdatedAt()
        }
    }
}