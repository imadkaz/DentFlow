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

routes.use('/clinics', ClinicRoutes(clinicController));
routes.use('/users', UserRoutes(userController));

export default routes;