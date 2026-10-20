// src/usecases/TreatmentPlan/CreateTreatmentPlanUsecase.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateTreatmentPlanUsecase } from '../CreateTreatmentPlanUsecase';
import { PlanStatus } from '../../../models/TreatmentPlan.model';
import { Patient } from '../../../models/Patient.model';
import { Doctor } from '../../../models/Doctor.model';
import {
    FakeDoctorRepository,
    FakePatientRepository,
    FakeTreatmentPlanRepository,
} from '../../../../tests/TreatmentFakes';
const input = {
    patientId: 'p1', doctorId: 'd1', treatmentType: 'Root canal',
    startDate: new Date('2026-10-01'), totalCost: 500,
};

describe('CreateTreatmentPlanUsecase', () => {
    let useCase: CreateTreatmentPlanUsecase;

    beforeEach(() => {
        const patient = Patient.create({ id: 'p1', clinicId: 'c1', name: 'Ahmad', initials: 'AHK' });
        const doctor = Doctor.create({ id: 'd1', clinicId: 'c1', userId: 'u1', name: 'Dr. Layla', licenseNo: 'LIC-1' });
        useCase = new CreateTreatmentPlanUsecase(
            new FakeTreatmentPlanRepository(),
            new FakePatientRepository([patient]),
            new FakeDoctorRepository([doctor]),
        );
    });

    it('creates a pending plan by default', async () => {
        const plan = await useCase.execute(input);
        expect(plan.getStatus()).toBe(PlanStatus.PENDING);
    });

    it('ignores a paidAmount sent by the client', async () => {
        const plan = await useCase.execute({ ...input, paidAmount: 5000 } as any);
        expect(plan.getPaidAmount()).toBe(0);
    });

    it('throws when the patient does not exist', async () => {
        await expect(useCase.execute({ ...input, patientId: 'missing' })).rejects.toThrow('Patient not found');
    });

    it('throws when the doctor does not exist', async () => {
        await expect(useCase.execute({ ...input, doctorId: 'missing' })).rejects.toThrow('Doctor not found');
    });

    it('rejects a second active plan for the same patient', async () => {
        await useCase.execute({ ...input, status: PlanStatus.ACTIVE });
        await expect(useCase.execute({ ...input, status: PlanStatus.ACTIVE }))
            .rejects.toThrow('already has an active treatment plan');
    });

    it('still allows a pending plan while an active one exists', async () => {
        await useCase.execute({ ...input, status: PlanStatus.ACTIVE });
        const pending = await useCase.execute({ ...input, status: PlanStatus.PENDING });
        expect(pending.getStatus()).toBe(PlanStatus.PENDING);
    });
});