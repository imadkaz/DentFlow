// src/usecases/CreateClinicUseCase.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { CreateClinicUsecase } from './CreateClinicUsecase';
import { IClinicRepository } from '../repository/IClinicRepository';
import { Clinic } from '../models/Clinic.model';

// تنفيذ وهمي (fake) للـ IClinicRepository — كله بالذاكرة، بدون Neon， بدون انترنت
class FakeClinicRepository implements IClinicRepository {
    private clinics = new Map<string, Clinic>();

    async findById(id: string): Promise<Clinic | null> {
        return this.clinics.get(id) ?? null;
    }

    async findByEmail(email: string): Promise<Clinic | null> {
        for (const clinic of this.clinics.values()) {
            if (clinic.getEmail() === email) return clinic;
        }
        return null;
    }

    async save(clinic: Clinic): Promise<Clinic> {
        this.clinics.set(clinic.getId(), clinic);
        return clinic;
    }

    async update(clinic: Clinic): Promise<Clinic> {
        this.clinics.set(clinic.getId(), clinic);
        return clinic;
    }

    async delete(id: string): Promise<void> {
        this.clinics.delete(id);
    }
}

describe('CreateClinicUsecase', () => {
    let repository: FakeClinicRepository;
    let useCase: CreateClinicUsecase;

    beforeEach(() => {
        repository = new FakeClinicRepository();
        useCase = new CreateClinicUsecase(repository);
    });

    it('creates a clinic with a generated id', async () => {
        const clinic = await useCase.execute({ name: 'Smile Dental' });

        expect(clinic.getName()).toBe('Smile Dental');
        expect(clinic.getId()).toBeTruthy();
    });

    it('persists the clinic in the repository', async () => {
        const clinic = await useCase.execute({ name: 'Smile Dental' });

        const found = await repository.findById(clinic.getId());
        expect(found).not.toBeNull();
    });

    it('throws when a clinic with the same email already exists', async () => {
        await useCase.execute({ name: 'First Clinic', email: 'shared@example.com' });

        await expect(
            useCase.execute({ name: 'Second Clinic', email: 'shared@example.com' }),
        ).rejects.toThrow('A clinic with this email already exists');
    });

    it('allows two clinics without an email', async () => {
        await useCase.execute({ name: 'Clinic A' });
        const second = await useCase.execute({ name: 'Clinic B' });

        expect(second.getName()).toBe('Clinic B');
    });

    it('propagates validation errors from the Clinic entity', async () => {
        await expect(useCase.execute({ name: '' })).rejects.toThrow(
            'Clinic name is required',
        );
    });
});