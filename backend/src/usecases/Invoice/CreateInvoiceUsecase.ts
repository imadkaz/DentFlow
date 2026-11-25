import { Invoice } from "../../models/Invoice.model";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { ITreatmentPlanRepository } from "../../repository/interfaces/ITreatmentPlanRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface CreateInvoiceInput {
    clinicId: string;       // from the request context, never from the body
    patientId: string;
    planId: string;
    amountCents: number;
    dueDate: Date;
}

export class CreateInvoiceUsecase {
    constructor(
        private readonly invoiceRepository: IInvoiceRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly treatmentPlanRepository: ITreatmentPlanRepository
    ) {}

    async execute(input: CreateInvoiceInput): Promise<Invoice> {
        const patient = await this.patientRepository.findById(input.patientId);
        // Same message for "missing" and "other clinic": don't reveal other tenants' records.
        if (!patient || patient.getClinicId() !== input.clinicId) {
            throw new NotFoundError('Patient not found');
        }

        const plan = await this.treatmentPlanRepository.findById(input.planId);
        if (!plan || plan.getPatientId() !== patient.getId()) {
            throw new NotFoundError('Treatment plan not found for this patient');
        }

        // status, issuedAt and paid amounts are server-owned.
        const invoice = Invoice.issue({
            id: crypto.randomUUID(),
            clinicId: input.clinicId,
            patientId: patient.getId(),
            planId: plan.getId(),
            amountCents: input.amountCents,
            dueDate: input.dueDate,
        });

        return this.invoiceRepository.save(invoice);
    }
}
