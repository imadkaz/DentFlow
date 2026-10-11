import { Router } from "express";
import { TreatmentPlanController } from "../Controllers/TreatmentPlanController";
import { asyncHandler } from "../middleware/asyncHandler";

export const TreatmentPlanRoutes = (treatmentPlanController: TreatmentPlanController) : Router => {
    const route = Router();

    route.post('/', asyncHandler(treatmentPlanController.createTreatment))
    route.get('/patient/:patientId', asyncHandler(treatmentPlanController.getPatientTreatments))
    route.put('/:id', asyncHandler(treatmentPlanController.updateTreatment))
    route.get('/:id', asyncHandler(treatmentPlanController.getTreatment))
    route.delete('/:id', asyncHandler(treatmentPlanController.deleteTreatment))

    return route

}