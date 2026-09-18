import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePatientUsecase } from './CreatePatientUsecase';
import { IPatientRepository } from '../../repository/interfaces/IPatientRepository';
import { IClinicRepository } from '../../repository/interfaces/IClinicRepository';
import { Patient } from '../../models/Patient.model';
import { Clinic } from '../../models/Clinic.model';

class FakePatientRepository implements IPatientRepository {
    private patients = new Map<string, Patient>();
    async findById(id: string) { return this.patients.get(id) ?? null; }
    async findByName(name: string) {
        return [...this.patients.values()].filter(p =>
            p.getName().toLowerCase().includes(name.toLowerCase()));
    }
    async save(p: Patient) { this.patients.set(p.getId(), p); return p; }
    async update(p: Patient) { this.patients.set(p.getId(), p); return p; }
    async delete(id: string) { this.patients.delete(id); }
}

class FakeClinicRepository implements IClinicRepository {
    private clinics = new Map<string, Clinic>();
    constructor(seed: Clinic[] = []) { seed.forEach(c => this.clinics.set(c.getId(), c)); }
    async findById(id: string) { return this.clinics.get(id) ?? null; }
    async findByEmail() { return null; }
    async save(c: Clinic) { this.clinics.set(c.getId(), c); return c; }
    async update(c: Clinic) { this.clinics.set(c.getId(), c); return c; }
    async delete(id: string) { this.clinics.delete(id); }
}

describe('CreatePatientUsecase', () => {
    let patientRepository: FakePatientRepository;
    let clinicRepository: FakeClinicRepository;
    let existingClinic: Clinic;
    let useCase: CreatePatientUsecase;

    beforeEach(() => {
        existingClinic = Clinic.create({ id: 'clinic-1', name: 'Smile Dental' });
        patientRepository = new FakePatientRepository();
        clinicRepository = new FakeClinicRepository([existingClinic]);
        useCase = new CreatePatientUsecase(patientRepository, clinicRepository);
    });

    it('creates a patient when the clinic exists', async () => {
        const patient = await useCase.execute({
            clinicId: 'clinic-1', name: 'Ahmad Khalil', initials: 'AHK',
        });
        expect(patient.getName()).toBe('Ahmad Khalil');
    });

    it('throws when the clinic does not exist', async () => {
        await expect(useCase.execute({
            clinicId: 'missing-clinic', name: 'Ahmad', initials: 'AHK',
        })).rejects.toThrow('Clinic not found');
    });

    it('propagates validation errors from the Patient entity', async () => {
        await expect(useCase.execute({
            clinicId: 'clinic-1', name: 'Ahmad', initials: 'AH',
        })).rejects.toThrow('Patient initials must be exactly 3 characters');
    });
});