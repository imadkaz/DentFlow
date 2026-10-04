import { Router } from "express";
import { MedicalController } from "../Controllers/MedicalController";
import { asyncHandler } from "../middleware/asyncHandler";

export const MedicalRoutes = (medicalController: MedicalController) : Router => {
    const route = Router();

    route.post('/', asyncHandler(medicalController.CreateMedical))
    route.patch('/:id', asyncHandler(medicalController.UpdateMedical))
    route.get('/:id', asyncHandler(medicalController.GetMedical))
    route.get('/patient/:patientId', asyncHandler(medicalController.GetPatientMedical))
    route.delete('/:id', asyncHandler(medicalController.DeleteMedical))

    return route
}