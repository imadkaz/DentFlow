import { Request, Response } from "express";
import { Invoice } from "../models/Invoice.model";
import { CreateInvoiceUsecase } from "../usecases/Invoice/CreateInvoiceUsecase";
import { GetInvoiceUsecase } from "../usecases/Invoice/GetInvoiceUsecase";
import { GetPatientInvoicesUsecase } from "../usecases/Invoice/GetPatientInvoicesUsecase";
import { UpdateInvoiceUsecase } from "../usecases/Invoice/UpdateInvoiceUsecase";
import { VoidInvoiceUsecase } from "../usecases/Invoice/VoidInvoiceUsecase";
import { formatDateOnly, parseDateOnly } from "../util/date";
import { ValidationError } from "../util/exceptions/http/ValidationError";
import { getRequestContext } from "../util/requestContext";

export class InvoiceController {
    constructor(
        private readonly getInvoiceUsecase: GetInvoiceUsecase,
        private readonly createInvoiceUsecase: CreateInvoiceUsecase,
        private readonly updateInvoiceUsecase: UpdateInvoiceUsecase,
        private readonly voidInvoiceUsecase: VoidInvoiceUsecase,
        private readonly getPatientInvoicesUsecase: GetPatientInvoicesUsecase
    ) {}

    createInvoice = async (req: Request, res: Response) => {
        const { clinicId } = getRequestContext(req);
        const input = req.body ?? {};

        // Only these fields are accepted. status / issuedAt / clinicId in the body are ignored.
        const invoice = await this.createInvoiceUsecase.execute({
            clinicId,
            patientId: this.requireString(input.patientId, 'patientId'),
            planId: this.requireString(input.planId, 'planId'),
            amountCents: input.amountCents,
            dueDate: parseDateOnly(input.dueDate, 'dueDate'),
        });

        res.status(201).json(this.toResponse(invoice));
    }

    getInvoice = async (req: Request, res: Response) => {
        const { clinicId } = getRequestContext(req);
        const invoice = await this.getInvoiceUsecase.executeById(req.params.id as string, clinicId);
        res.status(200).json(this.toResponse(invoice));
    }

    getPatientInvoices = async (req: Request, res: Response) => {
        const { clinicId } = getRequestContext(req);
        const invoices = await this.getPatientInvoicesUsecase.execute(req.params.patientId as string, clinicId);
        res.status(200).json(invoices.map((i) => this.toResponse(i)));
    }

    updateInvoice = async (req: Request, res: Response) => {
        const { clinicId } = getRequestContext(req);
        const input = req.body ?? {};

        const invoice = await this.updateInvoiceUsecase.execute({
            id: req.params.id as string,
            clinicId,
            dueDate: parseDateOnly(input.dueDate, 'dueDate'),
        });

        res.status(200).json(this.toResponse(invoice));
    }

    voidInvoice = async (req: Request, res: Response) => {
        const { clinicId } = getRequestContext(req);
        const invoice = await this.voidInvoiceUsecase.execute(req.params.id as string, clinicId);
        res.status(200).json(this.toResponse(invoice));
    }

    private requireString(value: unknown, field: string): string {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new ValidationError(`${field} is required`);
        }
        return value;
    }

    private toResponse(invoice: Invoice) {
        return {
            id: invoice.getId(),
            clinicId: invoice.getClinicId(),
            patientId: invoice.getPatientId(),
            planId: invoice.getPlanId(),
            status: invoice.getStatus(),
            amountCents: invoice.getAmountCents(),
            paidCents: invoice.getPaidCents(),
            balanceCents: invoice.getBalanceCents(),
            dueDate: formatDateOnly(invoice.getDueDate()),
            issuedAt: invoice.getIssuedAt(),
        };
    }
}
