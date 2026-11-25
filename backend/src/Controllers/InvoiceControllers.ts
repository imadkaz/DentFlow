import { Invoice } from "../models/Invoice.model";
import { CreateInvoiceUsecase } from "../usecases/Invoice/CreateInvoiceUsecase";
import { GetInvoiceUsecase } from "../usecases/Invoice/GetInvoiceUsecase";
import { UpdateInvoiceUsecase } from "../usecases/Invoice/UpdateInvoiceUsecase";
import { Request, Response } from "express";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";

export class InvoiceController {
    constructor(
        private readonly getInvoiceUsecase: GetInvoiceUsecase,
        private readonly createInvoiceUsecase: CreateInvoiceUsecase,
        private readonly updateInvoiceUsecase: UpdateInvoiceUsecase
    ) {}

    CreateInvoice = async (req: Request, res: Response) => {

        const input = await req.body;
        const invoice = await this.createInvoiceUsecase.execute({
            patientId: input.patientId,
            clinicId: input.clinicId,
            planId: input.planId,
            status: input.status,
            amount: input.amount,
            dueDate: input.dueDate,
            issuedAt: input.issuedAt,
        });

        res.status(201).json(this.toResponse(invoice));
    }

    getInvoice = async (req: Request, res: Response) => {
        const  id  = req.params.id;
        if (!id) {
            throw new NotFoundError("Invoice ID is required");
        }
        const invoice = await this.getInvoiceUsecase.executeById(id as string);
        res.status(200).json(this.toResponse(invoice));
    }

    updateInvoice = async (req: Request, res: Response) => {
        const id = req.params.id;
        const input = req.body;

        if (!id) {
            throw new NotFoundError("Invoice ID is required");
        }
        
        const updatedInvoice = await this.updateInvoiceUsecase.execute({
            id: id as string,
            status: input.status,
            amount: input.amount,
            dueDate: input.dueDate,
            issuedAt: input.issuedAt,
        });

        res.status(200).json(this.toResponse(updatedInvoice));
    }

    private toResponse(invoice: Invoice) {
        return {
            id: invoice.getId(),
            patientId: invoice.getPatientId(),
            clinicId: invoice.getClinicId(),
            planId: invoice.getPlanId(),
            status: invoice.getStatus(),
            amount: invoice.getAmount(),
            dueDate: invoice.getDueDate(),
            issuedAt: invoice.getIssuedAt(),
        };
    }

}