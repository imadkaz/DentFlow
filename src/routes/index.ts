// src/routes/index.ts
import { Router } from 'express';
import { prisma } from '../db';

// Clinic
import { ClinicRoutes } from './Clinic.Routes';
import { ClinicControllers } from '../Controllers/ClinicControllers';
import { ClinicRepository } from '../repository/ClinicRepository';
import { CreateClinicUsecase } from '../usecases/clinic/CreateClinicUsecase';
import { UpdateClinicUsecase } from '../usecases/clinic/UpdateClinicUsecase';
import { DeleteClinicUsecase } from '../usecases/clinic/DeleteClinicUsecase';
import { GetClinicUsecase } from '../usecases/clinic/GetClinicUsecase';

// User
import { UserRoutes } from './User.Routes';
import { UserController } from '../Controllers/UserControllers';
import { UserRepository } from '../repository/userRepository';
import { CreateUserUsecase } from '../usecases/user/CreateUserUsecase';
import { UpdateUserUsecase } from '../usecases/user/UpdateUserUsecase';
import { DeleteUserUsecase } from '../usecases/user/DeleteUserUsecase';
import { GetUserUsecase } from '../usecases/user/GetUserUsecase';

// Doctor
import { DoctorRoutes } from './Doctor.Routes';
import { DoctorController } from '../Controllers/DoctorController';
import { DoctorRepository } from '../repository/DoctorRepository';
import { CreateDoctorUsecase } from '../usecases/doctor/CreateDoctorUsecase';
import { getDoctorUsecase } from '../usecases/doctor/GetDoctorUsecase';
import { UpdateDoctorUsecase } from '../usecases/doctor/UpdateDoctorUsecase';
import { DeleteDoctorUsecase } from '../usecases/doctor/DeleteDoctorUsecase';
import { PatientRepository } from '../repository/PatientRepository';
import { PatientController } from '../Controllers/PatientController';
import { CreatePatientUsecase } from '../usecases/Patient/CreatePatientUsecase';
import { UpdatePatientUsecase } from '../usecases/Patient/UpdatePatientUsecase';
import { GetPatientUsecase } from '../usecases/Patient/GetPatientUsecase';
import { DeletePatientUsecase } from '../usecases/Patient/DeletepatientUsecase';
import { PatientRoutes } from './Patient.Routes';

const routes = Router();

// ---- Clinic wiring ----
const clinicRepository = new ClinicRepository(prisma);
const clinicController = new ClinicControllers(
    new GetClinicUsecase(clinicRepository),
    new DeleteClinicUsecase(clinicRepository),
    new UpdateClinicUsecase(clinicRepository),
    new CreateClinicUsecase(clinicRepository),
);

// ---- User wiring ----
const userRepository = new UserRepository(prisma);
const userController = new UserController(
    new GetUserUsecase(userRepository),
    new DeleteUserUsecase(userRepository),
    new UpdateUserUsecase(userRepository),
    new CreateUserUsecase(userRepository),
);

// ---- Doctor wiring ----
const doctorRepository = new DoctorRepository(prisma);
const doctorController = new DoctorController(
    new CreateDoctorUsecase(doctorRepository, clinicRepository, userRepository),
    new UpdateDoctorUsecase(doctorRepository),
    new getDoctorUsecase(doctorRepository),
    new DeleteDoctorUsecase(doctorRepository)
)

// ---- Patient wiring ----
const patientRepository = new PatientRepository(prisma);
const patientController = new PatientController(
    new CreatePatientUsecase(patientRepository, clinicRepository),
    new UpdatePatientUsecase(patientRepository),
    new GetPatientUsecase(patientRepository),
    new DeletePatientUsecase(patientRepository)
)

routes.use('/clinics', ClinicRoutes(clinicController));
routes.use('/users', UserRoutes(userController));
routes.use('/doctors', DoctorRoutes(doctorController));
routes.use('/patients', PatientRoutes(patientController))

export default routes;
