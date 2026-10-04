import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { ToothRecordController } from "../Controllers/ToothRecordController";



export const ToothRecordRoutes = (toothRecordController: ToothRecordController): Router => {
    const router = Router();

    router.get('/:patientId/teeth', asyncHandler(toothRecordController.getPatientTeeth));
    router.put('/:patientId/teeth/:num', asyncHandler(toothRecordController.upsertToothRecord));
    
    return router;
};