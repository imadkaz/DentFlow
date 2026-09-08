// src/routes/Clinic.Routes.ts
import { Router } from "express";
import { ClinicControllers } from "../Controllers/ClinicControllers";

export function ClinicRoutes(clinicControllers: ClinicControllers): Router {
    const router = Router();
    router.post('/', clinicControllers.createClinic);
    router.get('/:id', clinicControllers.getClinicById);
    router.get('/email/:email', clinicControllers.getClinicByEmail);
    router.delete('/:id', clinicControllers.deleteClinic);
    router.put('/:id', clinicControllers.updateClinic);

    return router;
}