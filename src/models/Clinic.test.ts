import { Clinic } from './Clinic.model';

// src/repository/ClinicRepository.integration.test.ts

import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { describe, it, expect, afterEach } from 'vitest';
import { prisma } from '../db';
import { ClinicRepository } from '../repository/ClinicRepository';

const clinicRepository = new ClinicRepository(prisma);

// كل test بيسجّل الـ id يلي أنشأه هون، حتى ننضّفه بعد ما يخلص
const createdIds: string[] = [];

afterEach(async () => {
    for (const id of createdIds) {
        await prisma.clinic.deleteMany({ where: { id } });
    }
    createdIds.length = 0;
});

describe('ClinicRepository (integration)', () => {
    it('saves a clinic and reads it back by id', async () => {
        const clinic = Clinic.create({
            id: randomUUID(),
            name: 'Integration Test Clinic',
            email: `test-${Date.now()}@example.com`,
        });

        const saved = await clinicRepository.save(clinic);
        createdIds.push(saved.getId());

        const found = await clinicRepository.findById(saved.getId());

        expect(found).not.toBeNull();
        expect(found?.getName()).toBe('Integration Test Clinic');
    });

    it('finds a clinic by email', async () => {
        const email = `test-${Date.now()}@example.com`;
        const clinic = Clinic.create({
            id: randomUUID(),
            name: 'Findable Clinic',
            email,
        });

        const saved = await clinicRepository.save(clinic);
        createdIds.push(saved.getId());

        const found = await clinicRepository.findByEmail(email);

        expect(found).not.toBeNull();
        expect(found?.getId()).toBe(saved.getId());
    });

    it('returns null when clinic does not exist', async () => {
        const found = await clinicRepository.findById(randomUUID());

        expect(found).toBeNull();
    });

    it('updates a clinic', async () => {
        const clinic = Clinic.create({ id: randomUUID(), name: 'Before Update' });
        const saved = await clinicRepository.save(clinic);
        createdIds.push(saved.getId());

        saved.rename('After Update');
        await clinicRepository.update(saved);

        const found = await clinicRepository.findById(saved.getId());
        expect(found?.getName()).toBe('After Update');
    });

    it('deletes a clinic', async () => {
        const clinic = Clinic.create({ id: randomUUID(), name: 'To Be Deleted' });
        const saved = await clinicRepository.save(clinic);

        await clinicRepository.delete(saved.getId());

        const found = await clinicRepository.findById(saved.getId());
        expect(found).toBeNull();
    });
});

// describe('Clinic', () => {
//     it('creates a valid clinic with just a name', () => {
//         const clinic = Clinic.create({ id: '1', name: 'Smile Dental' });

//         expect(clinic.getName()).toBe('Smile Dental');
//         expect(clinic.getId()).toBe('1');
//         expect(clinic.getPhone()).toBeNull();
//         expect(clinic.getEmail()).toBeNull();
//         expect(clinic.getLogoUrl()).toBeNull();
//     });

//     it('trims whitespace from the name', () => {
//         const clinic = Clinic.create({ id: '1', name: '  Smile Dental  ' });

//         expect(clinic.getName()).toBe('Smile Dental');
//     });

//     it('throws when name is empty', () => {
//         expect(() => Clinic.create({ id: '1', name: '' })).toThrow(
//             'Clinic name is required',
//         );
//     });

//     it('throws when name is only whitespace', () => {
//         expect(() => Clinic.create({ id: '1', name: '   ' })).toThrow(
//             'Clinic name is required',
//         );
//     });

//     it('throws when name exceeds 120 characters', () => {
//         const longName = 'a'.repeat(121);

//         expect(() => Clinic.create({ id: '1', name: longName })).toThrow(
//             'Clinic name must be at most 120 characters',
//         );
//     });

//     it('accepts optional fields when provided', () => {
//         const clinic = Clinic.create({
//             id: '1',
//             name: 'Smile Dental',
//             phone: '+96170123456',
//             email: 'contact@smiledental.com',
//         });

//         expect(clinic.getPhone()).toBe('+96170123456');
//         expect(clinic.getEmail()).toBe('contact@smiledental.com');
//     });

//     it('renames the clinic and updates updatedAt', () => {
//         const clinic = Clinic.create({ id: '1', name: 'Old Name' });
//         const originalUpdatedAt = clinic.getUpdatedAt();

//         clinic.rename('New Name');

//         expect(clinic.getName()).toBe('New Name');
//         expect(clinic.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
//             originalUpdatedAt.getTime(),
//         );
//     });

//     it('throws when renaming to an empty name', () => {
//         const clinic = Clinic.create({ id: '1', name: 'Smile Dental' });

//         expect(() => clinic.rename('')).toThrow('Clinic name is required');
//     });
// });