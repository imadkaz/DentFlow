// src/models/tests/TreatmentPlan.test.ts
import { describe, it, expect } from 'vitest';
import { TreatmentPlan, PlanStatus } from '../TreatmentPlan.model';

const base = {
    id: '1', patientId: 'p1', doctorId: 'd1', treatmentType: 'Root canal',
    startDate: new Date('2026-10-01'), totalCost: 500,
};

describe('TreatmentPlan', () => {
    it('applies safe defaults', () => {
        const plan = TreatmentPlan.create(base);
        expect(plan.getStatus()).toBe(PlanStatus.PENDING);
        expect(plan.getPaidAmount()).toBe(0);
        expect(plan.getNextAppAt()).toBeNull();   // regression: كان now()
        expect(plan.getEndDate()).toBeNull();
    });

    it('throws when treatment type is empty', () => {
        expect(() => TreatmentPlan.create({ ...base, treatmentType: '  ' })).toThrow('Treatment type is required');
    });

    it('throws when total cost is negative', () => {
        expect(() => TreatmentPlan.create({ ...base, totalCost: -1 })).toThrow('Total cost cannot be negative');
    });

    it('throws when paid amount exceeds total cost', () => {
        expect(() => TreatmentPlan.create({ ...base, paidAmount: 600 })).toThrow('Paid amount cannot exceed total cost');
    });
});