// src/repository/Appointment.integration.test.ts
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { describe, it, expect, afterEach } from 'vitest';
import { prisma } from '../db';
import { AppointmentRepository } from './AppointmentRepository';
import { PatientRepository } from './PatientRepository';
import { DoctorRepository } from './DoctorRepository';
import { ClinicRepository } from './ClinicRepository';
import { UserRepository } from './userRepository';
import { Appointment } from '../models/Appointment.model';
import { Patient } from '../models/Patient.model';
import { Doctor } from '../models/Doctor.model';
import { Clinic } from '../models/Clinic.model';
import { User } from '../models/User.model';

const appointmentRepository = new AppointmentRepository(prisma);
const patientRepository = new PatientRepository(prisma);
const doctorRepository = new DoctorRepository(prisma);
const clinicRepository = new ClinicRepository(prisma);
const userRepository = new UserRepository(prisma);

const createdAppointmentIds: string[] = [];
const createdPatientIds: string[] = [];
const createdDoctorIds: string[] = [];
const createdUserIds: string[] = [];
const createdClinicIds: string[] = [];

afterEach(async () => {
    for (const id of createdAppointmentIds) await prisma.appointment.deleteMany({ where: { id } });
    for (const id of createdPatientIds) await prisma.patient.deleteMany({ where: { id } });
    for (const id of createdDoctorIds) await prisma.doctor.deleteMany({ where: { id } });
    for (const id of createdUserIds) await prisma.user.deleteMany({ where: { id } });
    for (const id of createdClinicIds) await prisma.clinic.deleteMany({ where: { id } });
    createdAppointmentIds.length = 0;
    createdPatientIds.length = 0;
    createdDoctorIds.length = 0;
    createdUserIds.length = 0;
    createdClinicIds.length = 0;
});

async function setupFixtures() {
    const clinic = await clinicRepository.save(Clinic.create({ id: randomUUID(), name: 'Test Clinic' }));
    createdClinicIds.push(clinic.getId());

    const user = await userRepository.save(User.create({
        id: randomUUID(), firstName: 'Layla', lastName: 'Aoun',
        email: `doc-${Date.now()}@example.com`, passwordHash: 'hashed',
    }));
    createdUserIds.push(user.getId());

    const doctor = await doctorRepository.save(Doctor.create({
        id: randomUUID(), clinicId: clinic.getId(), userId: user.getId(),
        name: 'Dr. Layla', licenseNo: `LIC-${Date.now()}`,
        createdAt: new Date()
    }));
    createdDoctorIds.push(doctor.getId());

    const patient = await patientRepository.save(Patient.create({
        id: randomUUID(), clinicId: clinic.getId(), name: 'Ahmad Khalil', initials: 'AHK',
    }));
    createdPatientIds.push(patient.getId());

    return { doctor, patient };
}

describe('AppointmentRepository (integration)', () => {
    it('saves an appointment and reads it back', async () => {
        const { doctor, patient } = await setupFixtures();

        const appointment = Appointment.create({
            id: randomUUID(), patientId: patient.getId(), doctorId: doctor.getId(),
            procedure: 'Cleaning', apptDate: new Date('2026-10-05'),
            apptTime: new Date('2026-10-05T09:00:00'),
        });

        const saved = await appointmentRepository.save(appointment);
        createdAppointmentIds.push(saved.getId());

        const found = await appointmentRepository.findById(saved.getId());
        expect(found?.getProcedure()).toBe('Cleaning');
    });

    it('updates an appointment', async () => {
        const { doctor, patient } = await setupFixtures();
        const appointment = Appointment.create({
            id: randomUUID(), patientId: patient.getId(), doctorId: doctor.getId(),
            procedure: 'Cleaning', apptDate: new Date(), apptTime: new Date(),
        });
        const saved = await appointmentRepository.save(appointment);
        createdAppointmentIds.push(saved.getId());

        const updated = Appointment.create({
            id: saved.getId(), patientId: saved.getPatientId(), doctorId: saved.getDoctorId(),
            procedure: 'X-Ray', apptDate: saved.getApptDate(), apptTime: saved.getApptTime(),
            createdAt: saved.getCreatedAt(), updatedAt: new Date(),
        });
        await appointmentRepository.update(updated);

        const found = await appointmentRepository.findById(saved.getId());
        expect(found?.getProcedure()).toBe('X-Ray');
    });

    it('deletes an appointment', async () => {
        const { doctor, patient } = await setupFixtures();
        const appointment = Appointment.create({
            id: randomUUID(), patientId: patient.getId(), doctorId: doctor.getId(),
            procedure: 'Cleaning', apptDate: new Date(), apptTime: new Date(),
        });
        const saved = await appointmentRepository.save(appointment);

        await appointmentRepository.delete(saved.getId());
        const found = await appointmentRepository.findById(saved.getId());
        expect(found).toBeNull();
    });
});