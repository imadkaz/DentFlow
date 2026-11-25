import { Request, Response } from "express";
import { Payment, PayMethod } from "../models/Payment.model";
import { GetInvoicePaymentsUsecase } from "../usecases/Payment/GetInvoicePaymentsUsecase";
import { RecordPaymentUsecase } from "../usecases/Payment/RecordPaymentUsecase";
import { ValidationError } from "../util/exceptions/http/ValidationError";
import { getRequestContext } from "../util/requestContext";

export class PaymentController {
    constructor(
        private readonly recordPaymentUsecase: RecordPaymentUsecase,
        private readonly getInvoicePaymentsUsecase: GetInvoicePaymentsUsecase
    ) {}

    recordPayment = async (req: Request, res: Response) => {
        const { clinicId } = getRequestContext(req);
        const input = req.body ?? {};

        let paidAt: Date | undefined;
        if (input.paidAt !== undefined) {
            paidAt = new Date(input.paidAt);
            if (isNaN(paidAt.getTime())) {
                throw new ValidationError('paidAt is not a valid date');
            }
        }

        const payment = await this.recordPaymentUsecase.execute({
            clinicId,
            invoiceId: req.params.id as string,
            amountCents: input.amountCents,
            method: input.method as PayMethod | undefined,
            reference: input.reference,
            paidAt,
        });

        res.status(201).json(this.toResponse(payment));
    }

    getInvoicePayments = async (req: Request, res: Response) => {
        const { clinicId } = getRequestContext(req);
        const payments = await this.getInvoicePaymentsUsecase.execute(req.params.id as string, clinicId);
        res.status(200).json(payments.map((p) => this.toResponse(p)));
    }

    private toResponse(payment: Payment) {
        return {
            id: payment.getId(),
            invoiceId: payment.getInvoiceId(),
            amountCents: payment.getAmountCents(),
            method: payment.getMethod(),
            reference: payment.getReference(),
            paidAt: payment.getPaidAt(),
        };
    }
}
