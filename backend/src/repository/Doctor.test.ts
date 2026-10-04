import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { describe, it, expect, afterEach } from 'vitest';
import { prisma } from '../db';
import { DoctorRepository } from './DoctorRepository';
import { ClinicRepository } from './ClinicRepository';
import { UserRepository } from './userRepository';
import { Doctor } from '../models/Doctor.model';
import { Clinic } from '../models/Clinic.model';
import { User } from '../models/User.model';

const doctorRepository = new DoctorRepository(prisma);
const clinicRepository = new ClinicRepository(prisma);
const userRepository = new UserRepository(prisma);

const createdDoctorIds: string[] = [];
const createdClinicIds: string[] = [];
const createdUserIds: string[] = [];

afterEach(async () => {
    for (const id of createdDoctorIds) await prisma.doctor.deleteMany({ where: { id } });
    for (const id of createdUserIds) await prisma.user.deleteMany({ where: { id } });
    for (const id of createdClinicIds) await prisma.clinic.deleteMany({ where: { id } });
    createdDoctorIds.length = 0;
    createdUserIds.length = 0;
    createdClinicIds.length = 0;
});

describe('DoctorRepository (integration)', () => {
    it('saves a doctor and reads it back by id', async () => {
        const clinic = await clinicRepository.save(Clinic.create({ id: randomUUID(), name: 'Test Clinic' }));
        createdClinicIds.push(clinic.getId());

        const user = await userRepository.save(User.create({
            id: randomUUID(), firstName: 'Layla', lastName: 'Aoun',
            email: `doc-${Date.now()}@example.com`, passwordHash: 'hashed',
        }));
        createdUserIds.push(user.getId());

        const doctor = Doctor.create({
            id: randomUUID(), clinicId: clinic.getId(), userId: user.getId(),
            name: 'Dr. Layla', licenseNo: `LIC-${Date.now()}`,
            createdAt: new Date()
        });
        const saved = await doctorRepository.save(doctor);
        createdDoctorIds.push(saved.getId());

        const found = await doctorRepository.findById(saved.getId());
        expect(found?.getName()).toBe('Dr. Layla');
    });
});