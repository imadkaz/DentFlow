import { Invoice, InvoiceStatus } from "../../models/Invoice.model";
import { IClinicRepository } from "../../repository/interfaces/IClinicRepository";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { ITreatmentPlanRepository } from "../../repository/interfaces/ITreatmentPlanRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface CreateInvoiceInput {
    patientId: string;
    clinicId: string;
    planId: string;
    status: InvoiceStatus;
    amount: number;
    dueDate: Date;
    issuedAt?: Date;
}

export class CreateInvoiceUsecase {
    constructor(
        private readonly invoiceRepository: IInvoiceRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly clinicRepository: IClinicRepository,
        private readonly treatmentPlanRepository: ITreatmentPlanRepository
    ) {}

    async execute(input: CreateInvoiceInput) {
        const patient = await this.patientRepository.findById(input.patientId);
        if (!patient) {
            throw new NotFoundError('Patient not found');
        }
        const clinic = await this.clinicRepository.findById(input.clinicId);
        if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }
        const treatmentPlan = await this.treatmentPlanRepository.findById(input.planId);
        if (!treatmentPlan) {
            throw new NotFoundError('Treatment plan not found');
        }

        const invoice = Invoice.create({
            id: crypto.randomUUID(),
            patientId: input.patientId,
            clinicId: input.clinicId,
            planId: input.planId,
            status: input.status,
            amount: input.amount,
            dueDate: input.dueDate,
            issuedAt: input.issuedAt,
        });

        return this.invoiceRepository.save(invoice);
    }
}