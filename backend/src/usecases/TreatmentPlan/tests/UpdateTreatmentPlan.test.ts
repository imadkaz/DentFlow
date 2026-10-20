// src/usecases/TreatmentPlan/UpdateTreatmentPlanUsecase.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateTreatmentPlanUsecase } from '../UpdateTreatmentPlanUsecase';
import { TreatmentPlan, PlanStatus } from '../../../models/TreatmentPlan.model';
import { FakeTreatmentPlanRepository } from '../../../../tests/TreatmentFakes';

function makePlan(overrides: Partial<Parameters<typeof TreatmentPlan.create>[0]> = {}) {
    return TreatmentPlan.create({
        id: 'plan1', patientId: 'p1', doctorId: 'd1', treatmentType: 'Root canal',
        startDate: new Date('2026-10-01'), totalCost: 500, paidAmount: 200,
        nextApptAt: new Date('2026-10-10'), ...overrides,
    });
}

describe('UpdateTreatmentPlanUsecase', () => {
    let repository: FakeTreatmentPlanRepository;
    let useCase: UpdateTreatmentPlanUsecase;

    beforeEach(async () => {
        repository = new FakeTreatmentPlanRepository();
        await repository.save(makePlan());
        useCase = new UpdateTreatmentPlanUsecase(repository);
    });

    it('keeps paidAmount even if the client sends one', async () => {
        const updated = await useCase.execute({ id: 'plan1', totalCost: 600 });
        expect(updated.getTotalCost()).toBe(600);
        expect(updated.getPaidAmount()).toBe(200);
    });

    it('keeps nextApptAt when it is not part of the update', async () => {
        const updated = await useCase.execute({ id: 'plan1', treatmentType: 'Crown' });
        expect(updated.getNextAppAt()).toEqual(new Date('2026-10-10'));
    });

    it('rejects lowering total cost below what was already paid', async () => {
        await expect(useCase.execute({ id: 'plan1', totalCost: 100 }))
            .rejects.toThrow('Paid amount cannot exceed total cost');
    });

    it('throws when the plan does not exist', async () => {
        await expect(useCase.execute({ id: 'missing' })).rejects.toThrow('Treatment plan not found');
    });

    it('does not conflict with itself when updating an already active plan', async () => {
        repository = new FakeTreatmentPlanRepository();
        await repository.save(makePlan({ status: PlanStatus.ACTIVE }));
        useCase = new UpdateTreatmentPlanUsecase(repository);
        const updated = await useCase.execute({ id: 'plan1', totalCost: 700 });
        expect(updated.getStatus()).toBe(PlanStatus.ACTIVE);
    });

    it('rejects activating a plan when another is already active', async () => {
        repository = new FakeTreatmentPlanRepository();
        await repository.save(makePlan({ id: 'plan1', status: PlanStatus.PENDING }));
        await repository.save(makePlan({ id: 'plan2', status: PlanStatus.ACTIVE }));
        useCase = new UpdateTreatmentPlanUsecase(repository);
        await expect(useCase.execute({ id: 'plan1', status: PlanStatus.ACTIVE }))
            .rejects.toThrow('Patient already has an active treatment plan');
    });

    it('allows activating a plan when none is active', async () => {
        const updated = await useCase.execute({ id: 'plan1', status: PlanStatus.ACTIVE });
        expect(updated.getStatus()).toBe(PlanStatus.ACTIVE);
    });
});