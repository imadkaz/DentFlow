import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { describe, it, expect, afterEach } from 'vitest';
import { prisma } from '../db';
import { PatientRepository } from './PatientRepository';
import { ClinicRepository } from './ClinicRepository';
import { Patient } from '../models/Patient.model';
import { Clinic } from '../models/Clinic.model';

const patientRepository = new PatientRepository(prisma);
const clinicRepository = new ClinicRepository(prisma);

const createdPatientIds: string[] = [];
const createdClinicIds: string[] = [];

afterEach(async () => {
    for (const id of createdPatientIds) await prisma.patient.deleteMany({ where: { id } });
    for (const id of createdClinicIds) await prisma.clinic.deleteMany({ where: { id } });
    createdPatientIds.length = 0;
    createdClinicIds.length = 0;
});

async function createTestClinic(): Promise<Clinic> {
    const clinic = Clinic.create({ id: randomUUID(), name: 'Test Clinic' });
    const saved = await clinicRepository.save(clinic);
    createdClinicIds.push(saved.getId());
    return saved;
}

describe('PatientRepository (integration)', () => {
    it('saves a patient and reads it back by id', async () => {
        const clinic = await createTestClinic();
        const patient = Patient.create({
            id: randomUUID(), clinicId: clinic.getId(), name: 'Ahmad Khalil', initials: 'AHK',
        });

        const saved = await patientRepository.save(patient);
        createdPatientIds.push(saved.getId());

        const found = await patientRepository.findById(saved.getId());
        expect(found?.getName()).toBe('Ahmad Khalil');
        expect(found?.getBalance()).toBe(0);
    });

    it('finds patients by partial, case-insensitive name', async () => {
        const clinic = await createTestClinic();
        const patient = Patient.create({
            id: randomUUID(), clinicId: clinic.getId(), name: 'Ahmad Khalil', initials: 'AHK',
        });
        const saved = await patientRepository.save(patient);
        createdPatientIds.push(saved.getId());

        const results = await patientRepository.findByName('ahmad');
        expect(results.some(p => p.getId() === saved.getId())).toBe(true);
    });

    it('updates a patient', async () => {
        const clinic = await createTestClinic();
        const patient = Patient.create({
            id: randomUUID(), clinicId: clinic.getId(), name: 'Before', initials: 'AAA',
        });
        const saved = await patientRepository.save(patient);
        createdPatientIds.push(saved.getId());

        const updated = Patient.create({
            id: saved.getId(), clinicId: saved.getClinicId(), name: 'After', initials: 'AAA',
            balance: saved.getBalance(), totalVisits: saved.getTotalVisits(),
            createdAt: saved.getCreatedAt(), updatedAt: new Date(),
        });
        await patientRepository.update(updated);

        const found = await patientRepository.findById(saved.getId());
        expect(found?.getName()).toBe('After');
    });

    it('deletes a patient', async () => {
        const clinic = await createTestClinic();
        const patient = Patient.create({
            id: randomUUID(), clinicId: clinic.getId(), name: 'ToDelete', initials: 'TTT',
        });
        const saved = await patientRepository.save(patient);

        await patientRepository.delete(saved.getId());

        const found = await patientRepository.findById(saved.getId());
        expect(found).toBeNull();
    });
});