    import { Router } from "express";
    import { PatientController } from "../Controllers/PatientController";
    import { asyncHandler } from "../middleware/asyncHandler";

    export const PatientRoutes = (patientController: PatientController) : Router => {
        const route = Router()

        route.post('/', asyncHandler(patientController.createPatient))
        route.put('/:id', asyncHandler(patientController.updatePatient))
        route.delete('/:id', asyncHandler(patientController.deletePatient))
        route.get('/:id', asyncHandler(patientController.getPatientById))
        route.get('/name/:name', asyncHandler(patientController.getPatientByName))

        return route
    }