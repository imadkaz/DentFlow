import { Router } from "express";
import { TreatmentStageController } from "../Controllers/TreatmentStageController";
import { asyncHandler } from "../middleware/asyncHandler";

export const TreatmentStageRoutes = (treatmentController: TreatmentStageController) : Router => {
    const route = Router();

    route.post('/', asyncHandler(treatmentController.create))
    route.get('/:id', asyncHandler(treatmentController.getStage))
    route.patch('/:id', asyncHandler(treatmentController.update))
    route.patch('/:id/complete', asyncHandler(treatmentController.completed))
    route.get('/plan/:planId', asyncHandler(treatmentController.getPlanStages));
    route.delete('/:id', asyncHandler(treatmentController.deleteStage))

    return route
}