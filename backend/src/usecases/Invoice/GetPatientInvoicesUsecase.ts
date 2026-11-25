import { Invoice } from "../../models/Invoice.model";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { IPatientRepository } from "../../repository/interfaces/IPatientRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetPatientInvoicesUsecase {
    constructor(
        private readonly invoiceRepository: IInvoiceRepository,
        private readonly patientRepository: IPatientRepository
    ) {}

    async execute(patientId: string, clinicId: string): Promise<Invoice[]> {
        const patient = await this.patientRepository.findById(patientId);
        if (!patient || patient.getClinicId() !== clinicId) {
            throw new NotFoundError('Patient not found');
        }
        return this.invoiceRepository.findByPatientId(patientId, clinicId);
    }
}
