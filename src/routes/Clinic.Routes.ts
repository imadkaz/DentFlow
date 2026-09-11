// src/routes/Clinic.Routes.ts
import { Router } from "express";
import { ClinicControllers } from "../Controllers/ClinicControllers";
import { asyncHandler } from "../middleware/asyncHandler";

export function ClinicRoutes(clinicControllers: ClinicControllers): Router {
    const router = Router();
    router.post('/', asyncHandler(clinicControllers.createClinic));
    router.get('/:id', asyncHandler(clinicControllers.getClinicById));
    router.get('/email/:email', asyncHandler(clinicControllers.getClinicByEmail));
    router.delete('/:id', asyncHandler(clinicControllers.deleteClinic));
    router.put('/:id', asyncHandler(clinicControllers.updateClinic));

    return router;
}