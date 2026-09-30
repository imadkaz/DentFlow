import { Router } from "express";
import { AppointmentController } from "../Controllers/AppointmentControllers";
import { asyncHandler } from "../middleware/asyncHandler";

export const AppointmentRoutes = (appointmentController: AppointmentController) : Router => {
    const route = Router()

    route.post('/', asyncHandler(appointmentController.createAppointment))
    route.patch('/:id', asyncHandler(appointmentController.updateAppointment))
    route.get('/:id', asyncHandler(appointmentController.getAppointmentById))
    route.delete('/:id', asyncHandler(appointmentController.deleteAppointment))
    route.get('/patient/:patientId', asyncHandler(appointmentController.getPatientAppointment))
    route.get('/doctor/:doctorId', asyncHandler(appointmentController.getDoctorAppointment))
    
    return route
}   