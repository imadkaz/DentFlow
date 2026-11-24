import { Invoice, InvoiceStatus } from "../../models/Invoice.model";
import { IInvoiceRepository } from "../../repository/interfaces/IInvoiceRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export interface InvoiceUpdateInput {
    id: string;
    status?: InvoiceStatus;
    amount?: number;
    dueDate?: Date;
    issuedAt?: Date;
}

export class UpdateInvoiceUsecase {
    constructor(
        private readonly invoiceRepository: IInvoiceRepository
    ) {}
    
    async execute(input: InvoiceUpdateInput) {
        const invoice = await this.invoiceRepository.findById(input.id);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        const updatedInvoice = Invoice.create({
            id: invoice.getId(),
            patientId: invoice.getPatientId(),
            clinicId: invoice.getClinicId(),
            planId: invoice.getPlanId(),
            status: input.status !== undefined ? input.status : invoice.getStatus(),
            amount: input.amount !== undefined ? input.amount : invoice.getAmount(),
            dueDate: input.dueDate !== undefined ? input.dueDate : invoice.getDueDate(),
            issuedAt: input.issuedAt !== undefined ? input.issuedAt : invoice.getIssuedAt(),
        });
        
        return this.invoiceRepository.update(updatedInvoice);
    }
}