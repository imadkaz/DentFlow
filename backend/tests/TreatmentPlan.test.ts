import { describe, it, expect, beforeEach } from 'vitest';
import { Doctor } from '../src/models/Doctor.model';
import { Patient } from '../src/models/Patient.model';
import { PlanStatus, TreatmentPlan } from '../src/models/TreatmentPlan.model';
import { TreatmentPlanRepository } from '../src/repository/TreatmentPlanRepository';
import { IDoctorRepository } from '../src/repository/interfaces/IDoctorRepository';
import { IPatientRepository } from '../src/repository/interfaces/IPatientRepository';
import { ITreatmentPlanRepository } from '../src/repository/interfaces/ITreatmentPlanRepository';
import { CreateTreatmentPlanUsecase } from '../src/usecases/TreatmentPlan/CreateTreatmentPlanUsecase';
import { DeleteTreatmentPlanUsecase } from '../src/usecases/TreatmentPlan/DeleteTreatmentPlanUsecase';
import { GetPatientTreatmentsUsecase } from '../src/usecases/TreatmentPlan/GetPatientTreatmentUsecase';
import { GetTreatmentPlanUsecase } from '../src/usecases/TreatmentPlan/GetTreatmentPlanUsecase';
import { UpdateTreatmentPlanUsecase } from '../src/usecases/TreatmentPlan/UpdateTreatmentPlanUsecase';

export class FakeTreatmentPlanRepository implements ITreatmentPlanRepository {
    readonly items = new Map<string, TreatmentPlan>();

    async findById(id: string) { return this.items.get(id) ?? null; }
    async save(plan: TreatmentPlan) { this.items.set(plan.getId(), plan); return plan; }
    async update(plan: TreatmentPlan) { this.items.set(plan.getId(), plan); return plan; }
    async delete(id: string) { this.items.delete(id); }
    async findActiveByPatient(patientId: string) {
        return [...this.items.values()].find(plan => plan.getPatientId() === patientId && plan.getStatus() === PlanStatus.ACTIVE) ?? null;
    }
    async findByPatientId(patientId: string) {
        return [...this.items.values()].filter(plan => plan.getPatientId() === patientId);
    }
}

class FakePatientRepository implements IPatientRepository {
    constructor(private readonly patient: Patient | null) {}
    async findById(id: string) { return this.patient?.getId() === id ? this.patient : null; }
    async save(patient: Patient) { return patient; }
    async update(patient: Patient) { return patient; }
    async delete() {}
    async findByName() { return this.patient ? [this.patient] : []; }
    async findByClinicId() { return this.patient ? [this.patient] : []; }
}

class FakeDoctorRepository implements IDoctorRepository {
    constructor(private readonly doctor: Doctor | null) {}
    async findById(id: string) { return this.doctor?.getId() === id ? this.doctor : null; }
    async save(doctor: Doctor) { return doctor; }
    async update(doctor: Doctor) { return doctor; }
    async delete() {}
    async findByLicenseNo() { return null; }
    async findByEmail() { return null; }
    async findByUserId() { return null; }
    async findByClinicId() { return this.doctor ? [this.doctor] : []; }
}

const patient = Patient.create({ id: 'patient-1', clinicId: 'clinic-1', name: 'Sam Patient', initials: 'SAM' });
const doctor = Doctor.create({ id: 'doctor-1', clinicId: 'clinic-1', userId: 'user-1', name: 'Dr. Test', licenseNo: 'LIC-1', createdAt: new Date() });
const newPlan = (overrides: Partial<Parameters<typeof TreatmentPlan.create>[0]> = {}) => TreatmentPlan.create({
    id: 'plan-1', patientId: 'patient-1', doctorId: 'doctor-1', treatmentType: 'Root canal',
    startDate: new Date('2026-01-01T00:00:00Z'), totalCost: 500, ...overrides,
});

describe('Treatment plan feature', () => {
    let repository: FakeTreatmentPlanRepository;

    beforeEach(() => { repository = new FakeTreatmentPlanRepository(); });

    describe('create', () => {
        const input = { patientId: 'patient-1', doctorId: 'doctor-1', treatmentType: 'Root canal', startDate: new Date('2026-01-01T00:00:00Z'), totalCost: 500 };

        it('creates and persists a pending plan when patient and doctor exist', async () => {
            const usecase = new CreateTreatmentPlanUsecase(repository, new FakePatientRepository(patient), new FakeDoctorRepository(doctor));
            const result = await usecase.execute(input);
            expect(result.getStatus()).toBe(PlanStatus.PENDING);
            expect(result.getPatientId()).toBe(patient.getId());
            expect(result.getDoctorId()).toBe(doctor.getId());
            expect(repository.items.get(result.getId())).toBe(result);
        });

        it('rejects a missing patient or doctor', async () => {
            const noPatient = new CreateTreatmentPlanUsecase(repository, new FakePatientRepository(null), new FakeDoctorRepository(doctor));
            const noDoctor = new CreateTreatmentPlanUsecase(repository, new FakePatientRepository(patient), new FakeDoctorRepository(null));
            await expect(noPatient.execute(input)).rejects.toThrow('Patient not found');
            await expect(noDoctor.execute(input)).rejects.toThrow('Doctor not found');
        });

        it('rejects a second active plan for the same patient', async () => {
            await repository.save(newPlan({ status: PlanStatus.ACTIVE }));
            const usecase = new CreateTreatmentPlanUsecase(repository, new FakePatientRepository(patient), new FakeDoctorRepository(doctor));
            await expect(usecase.execute({ ...input, status: PlanStatus.ACTIVE })).rejects.toThrow('Patient already has an active treatment plan');
        });
    });

    describe('read', () => {
        it('gets a plan by id and reports a missing plan', async () => {
            const plan = newPlan();
            await repository.save(plan);
            // The production use case currently depends on the concrete repository class.
            const usecase = new GetTreatmentPlanUsecase(repository as unknown as TreatmentPlanRepository);
            await expect(usecase.execute(plan.getId())).resolves.toBe(plan);
            await expect(usecase.execute('missing')).rejects.toThrow('Treatment plan not found');
        });

        it('lists plans for an existing patient and rejects an unknown patient', async () => {
            const plan = newPlan();
            await repository.save(plan);
            const usecase = new GetPatientTreatmentsUsecase(repository, new FakePatientRepository(patient));
            await expect(usecase.execute(patient.getId())).resolves.toEqual([plan]);
            const missingPatientUsecase = new GetPatientTreatmentsUsecase(repository, new FakePatientRepository(null));
            await expect(missingPatientUsecase.execute('missing')).rejects.toThrow('Patient not found');
        });
    });

    describe('update and delete', () => {
        it('updates an existing plan and reports missing plans', async () => {
            const plan = newPlan();
            await repository.save(plan);
            const usecase = new UpdateTreatmentPlanUsecase(repository as unknown as TreatmentPlanRepository);
            const updated = await usecase.execute({ id: plan.getId(), treatmentType: 'Crown', totalCost: 700 });
            expect(updated.getTreatmentType()).toBe('Crown');
            expect(updated.getTotalCost()).toBe(700);
            await expect(usecase.execute({ id: 'missing', treatmentType: 'Crown' })).rejects.toThrow('Treatment plan not found');
        });

        it('deletes an existing plan and reports missing plans', async () => {
            const plan = newPlan();
            await repository.save(plan);
            const usecase = new DeleteTreatmentPlanUsecase(repository as unknown as TreatmentPlanRepository);
            await expect(usecase.execute(plan.getId())).resolves.toBeUndefined();
            expect(repository.items.has(plan.getId())).toBe(false);
            await expect(usecase.execute('missing')).rejects.toThrow('Treatment plan not found');
        });
    });
});
