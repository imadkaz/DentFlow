import { Router } from 'express';
import  ClinicRoute  from './Clinic.Routes';

const routes = Router();

routes.use('/clinics', ClinicRoute);

export default routes;