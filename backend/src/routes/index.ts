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

// Patient
import { PatientRepository } from '../repository/PatientRepository';
import { PatientController } from '../Controllers/PatientController';
import { CreatePatientUsecase } from '../usecases/Patient/CreatePatientUsecase';
import { UpdatePatientUsecase } from '../usecases/Patient/UpdatePatientUsecase';
import { GetPatientUsecase } from '../usecases/Patient/GetPatientUsecase';
import { DeletePatientUsecase } from '../usecases/Patient/DeletepatientUsecase';
import { PatientRoutes } from './Patient.Routes';

// Appointment
import { AppointmentRepository } from '../repository/AppointmentRepository';
import { AppointmentController } from '../Controllers/AppointmentControllers';
import { CreateAppointmentUsecase } from '../usecases/Appointment/CreateAppointmentUsecase';
import { GetAppointmentUsecase } from '../usecases/Appointment/getAppointmentUsecase';
import { DeleteAppointmentUsecase } from '../usecases/Appointment/DeleteAppointmentUsecase';
import { UpdateAppointmentUsecase } from '../usecases/Appointment/UpdateAppointmentUsecase';
import { AppointmentRoutes } from './Appointment.Routes';
import { GetClinicPatientUsecase } from '../usecases/Patient/GetClinicpatientUsecase';
import { GetClinicDoctorUsecase } from '../usecases/doctor/GetClinicDoctorUsecase';
import { GetPatientAppointmentsUsecase } from '../usecases/Appointment/GetPatientAppointmentUsecase';
import { GetDoctorAppointmentsUsecase } from '../usecases/Appointment/GetDoctorAppointmentUsecase';
import { MedicalRecordRepository } from '../repository/MedicalRecordRepository';
import { MedicalController } from '../Controllers/MedicalController';
import { CreateMedialUsecase } from '../usecases/MedicalRecord/CreateMedicalUsecase';
import { UpdateMedicalUsecase } from '../usecases/MedicalRecord/UpdateMedicalUsecase';
import { DeleteMedicalUsecase } from '../usecases/MedicalRecord/DeleteMedicalUsecase';
import { GetMedicalUsecase } from '../usecases/MedicalRecord/getMedicalUsecase';
import { GetPatientMedicalUsecase } from '../usecases/MedicalRecord/GetPatientMedicalUsecase';
import { MedicalRoutes } from './Medical.Routes';
import { ToothRecordRepository } from '../repository/ToothRecordReposritory';
import { ToothRecordController } from '../Controllers/ToothRecordController';
import { UpsetToothRecordUsecase } from '../usecases/ToothRecord/UpsetToothRecordUsecase';
import { GetPatientTeethUsecase } from '../usecases/ToothRecord/GetPatientTeethUsecase';
import { ToothRecordRoutes } from './ToothRecord.Routes';



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
    new DeleteDoctorUsecase(doctorRepository),
    new GetClinicDoctorUsecase(doctorRepository, clinicRepository)

)

// ---- Patient wiring ----
const patientRepository = new PatientRepository(prisma);
const patientController = new PatientController(
    new CreatePatientUsecase(patientRepository, clinicRepository),
    new UpdatePatientUsecase(patientRepository),
    new GetPatientUsecase(patientRepository),
    new DeletePatientUsecase(patientRepository),
    new GetClinicPatientUsecase(patientRepository, clinicRepository)
)

// ---- Appointment wiring ----
const appointmentRepository = new AppointmentRepository(prisma);
const appointmentController = new AppointmentController(
    new CreateAppointmentUsecase(appointmentRepository, patientRepository, doctorRepository),
    new UpdateAppointmentUsecase(appointmentRepository),
    new GetAppointmentUsecase(appointmentRepository),
    new DeleteAppointmentUsecase(appointmentRepository),
    new GetDoctorAppointmentsUsecase(appointmentRepository, doctorRepository),
    new GetPatientAppointmentsUsecase(appointmentRepository, patientRepository)
)

// ---- Medical Record wiring ----

const medicalRecordRepository = new MedicalRecordRepository(prisma)
const medicalRecordController = new MedicalController(
    new CreateMedialUsecase(medicalRecordRepository, patientRepository),
    new UpdateMedicalUsecase(medicalRecordRepository),
    new DeleteMedicalUsecase(medicalRecordRepository),
    new GetMedicalUsecase(medicalRecordRepository),
    new GetPatientMedicalUsecase(medicalRecordRepository)
)

const toothRecordRepository = new ToothRecordRepository(prisma);
const toothRecordController = new ToothRecordController(
    new UpsetToothRecordUsecase(toothRecordRepository, patientRepository),
    new GetPatientTeethUsecase(toothRecordRepository, patientRepository)
)

routes.use('/clinics', ClinicRoutes(clinicController));
routes.use('/users', UserRoutes(userController));
routes.use('/doctors', DoctorRoutes(doctorController));
routes.use('/patients', PatientRoutes(patientController));
routes.use('/patients', ToothRecordRoutes(toothRecordController))
routes.use('/appointments', AppointmentRoutes(appointmentController));
routes.use('/medical-record', MedicalRoutes(medicalRecordController))

export default routes;
