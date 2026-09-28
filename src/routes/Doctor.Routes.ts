import { Router } from "express";
import { DoctorController } from "../Controllers/DoctorController";
import { asyncHandler } from "../middleware/asyncHandler";

export const  DoctorRoutes = (doctorController: DoctorController) : Router => {
    const route = Router();

    route.post('/', asyncHandler(doctorController.createDoctor))
    route.put('/:id', asyncHandler(doctorController.updateDoctor))
    route.get('/:id', asyncHandler(doctorController.getDoctorById))
    route.get('/email/:email', asyncHandler(doctorController.getDoctorByEmail))
    route.get('/lecenseNo/:licenseNo', asyncHandler(doctorController.getDoctorByLicenseNo))
    route.get('/clinic/:clinicId', asyncHandler(doctorController.getClinicDoctor))
    route.delete('/:id', asyncHandler(doctorController.deleteDoctor))
    
    return route
}