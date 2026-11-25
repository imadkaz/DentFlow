import { Router } from "express";
import { InvoiceController } from "../Controllers/InvoiceControllers";
import { PaymentController } from "../Controllers/PaymentController";
import { asyncHandler } from "../middleware/asyncHandler";

export const InvoiceRoutes = (
    invoiceController: InvoiceController,
    paymentController: PaymentController
): Router => {
    const route = Router();

    route.post('/', asyncHandler(invoiceController.createInvoice));
    route.get('/patient/:patientId', asyncHandler(invoiceController.getPatientInvoices));
    route.get('/:id', asyncHandler(invoiceController.getInvoice));
    route.patch('/:id', asyncHandler(invoiceController.updateInvoice));
    route.post('/:id/void', asyncHandler(invoiceController.voidInvoice));
    route.post('/:id/payments', asyncHandler(paymentController.recordPayment));
    route.get('/:id/payments', asyncHandler(paymentController.getInvoicePayments));

    return route;
};
