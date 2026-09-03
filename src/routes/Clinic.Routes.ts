import { Router } from "express";
import { ClinicControllers } from '../Controllers/ClinicControllers';
import { GetClinicUsecase } from '../usecases/GetClinicUsecase';
import { DeleteClinicUsecase } from '../usecases/DeleteClinicUsecase';
import { UpdateClinicUsecase } from '../usecases/UpdateClinicUsecase';
import { CreateClinicUsecase } from '../usecases/CreateClinicUsecase';
import { ClinicRepository } from '../repository/ClinicRepository';
import { prisma } from '../db';

const clinicRepository = new ClinicRepository(prisma);
const createClinicUseCase = new CreateClinicUsecase(clinicRepository);
const updateClinicUseCase = new UpdateClinicUsecase(clinicRepository);
const deleteClinicUseCase = new DeleteClinicUsecase(clinicRepository);
const getClinicUseCase = new GetClinicUsecase(clinicRepository);

const clinicController = new ClinicControllers(
    getClinicUseCase,
    deleteClinicUseCase,
    updateClinicUseCase,
    createClinicUseCase,
);

const router = Router();

router.post('/', clinicController.createClinic.bind(clinicController));
router.get('/:id', clinicController.getClinicById.bind(clinicController));
router.get('/email/:email', clinicController.getClinicByEmail.bind(clinicController));
router.delete('/:id', clinicController.deleteClinic.bind(clinicController));
router.put('/:id', clinicController.updateClinic.bind(clinicController));

export default router;