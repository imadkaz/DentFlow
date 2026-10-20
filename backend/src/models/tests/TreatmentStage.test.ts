// src/models/tests/TreatmentStage.test.ts
import { describe, it, expect } from 'vitest';
import { TreatmentStage } from '../TreatmentStage.model';

const base = { id: 's1', planId: 'plan1', name: 'Preparation', sequence: 1, completed: false };

describe('TreatmentStage', () => {
    it('creates an incomplete stage without completion date', () => {
        const stage = TreatmentStage.create(base);
        expect(stage.isCompleted()).toBe(false);
        expect(stage.getCompletedAt()).toBeNull();
        expect(stage.getNotes()).toBeNull();
    });

    it('throws when name is empty', () => {
        expect(() => TreatmentStage.create({ ...base, name: ' ' })).toThrow('Stage name is required');
    });

    it('throws when name exceeds 120 characters', () => {
        expect(() => TreatmentStage.create({ ...base, name: 'a'.repeat(121) })).toThrow('at most 120 characters');
    });

    it('throws when sequence is not a positive integer', () => {
        expect(() => TreatmentStage.create({ ...base, sequence: 0 })).toThrow('positive integer');
        expect(() => TreatmentStage.create({ ...base, sequence: 1.5 })).toThrow('positive integer');
    });

    it('throws when completed without a completion date', () => {
        expect(() => TreatmentStage.create({ ...base, completed: true })).toThrow('must have a completion date');
    });

    it('throws when incomplete but has a completion date', () => {
        expect(() => TreatmentStage.create({ ...base, completedAt: new Date() })).toThrow('cannot have a completion date');
    });

    it('complete() sets both completed and completedAt together', () => {
        const stage = TreatmentStage.create(base);
        stage.complete();
        expect(stage.isCompleted()).toBe(true);
        expect(stage.getCompletedAt()).toBeInstanceOf(Date);
    });

    it('complete() throws when already completed', () => {
        const stage = TreatmentStage.create(base);
        stage.complete();
        expect(() => stage.complete()).toThrow('already completed');
    });
});