import { describe, it, expect } from 'vitest';
import { TreatmentStage } from '../src/models/TreatmentStage.model';
import { ITreatmentStageRepository } from '../src/repository/interfaces/ITreatmentStageRepository';
import { UpdateTreatmentStageUsecase } from '../src/usecases/TreatmentStage/UpdateTreatmentStageUsecase';
import { DeleteTreatmentStageUsecase } from '../src/usecases/TreatmentStage/DeleteTreatmentStageUsecase';
import { ConflictError } from '../src/util/exceptions/http/ConflictError';
import { NotFoundError } from '../src/util/exceptions/http/NotFoundError';
import { ValidationError } from '../src/util/exceptions/http/ValidationError';

export class FakeTreatmentStageRepository implements ITreatmentStageRepository {
    private items = new Map<string, TreatmentStage>();
    constructor(seed: TreatmentStage[] = []) { seed.forEach(s => this.items.set(s.getId(), s)); }
    async findById(id: string) { return this.items.get(id) ?? null; }
    async findByPlanId(planId: string) {
        return [...this.items.values()]
            .filter(s => s.getPlanId() === planId)
            .sort((a, b) => a.getSequence() - b.getSequence());
    }
    async save(s: TreatmentStage) { this.items.set(s.getId(), s); return s; }
    async update(s: TreatmentStage) { this.items.set(s.getId(), s); return s; }
    async delete(id: string) { this.items.delete(id); }
}

describe('TreatmentStage', () => {
    it('creates a valid stage and trims the stage name', () => {
        const stage = TreatmentStage.create({
            id: 'stage-1',
            planId: 'plan-1',
            name: '  Initial consultation  ',
            sequence: 1,
            notes: 'First visit'
        });

        expect(stage.getName()).toBe('Initial consultation');
        expect(stage.getSequence()).toBe(1);
        expect(stage.isCompleted()).toBe(false);
        expect(stage.getCompletedAt()).toBeNull();
        expect(stage.getNotes()).toBe('First visit');
    });

    it('rejects invalid stage values', () => {
        expect(() => TreatmentStage.create({ id: 'stage-1', planId: 'plan-1', name: '', sequence: 1 })).toThrow(ValidationError);
        expect(() => TreatmentStage.create({ id: 'stage-1', planId: 'plan-1', name: 'a'.repeat(121), sequence: 1 })).toThrow('Stage name must be at most 120 characters');
        expect(() => TreatmentStage.create({ id: 'stage-1', planId: 'plan-1', name: 'Consultation', sequence: 0 })).toThrow('Stage sequence must be a positive integer');
    });

    it('requires a completion date for completed stages and forbids one for incomplete stages', () => {
        expect(() => TreatmentStage.create({
            id: 'stage-1',
            planId: 'plan-1',
            name: 'Consultation',
            sequence: 1,
            completed: true,
            completedAt: null
        })).toThrow('A Completed plan must have a completion date');

        expect(() => TreatmentStage.create({
            id: 'stage-1',
            planId: 'plan-1',
            name: 'Consultation',
            sequence: 1,
            completed: false,
            completedAt: new Date()
        })).toThrow('An incomplete stage cannot have a completion date');
    });

    it('marks a stage complete once and stores the completion timestamp', () => {
        const stage = TreatmentStage.create({
            id: 'stage-1',
            planId: 'plan-1',
            name: 'Consultation',
            sequence: 1
        });

        const completionDate = new Date('2026-01-15T10:00:00Z');
        stage.complete(completionDate);

        expect(stage.isCompleted()).toBe(true);
        expect(stage.getCompletedAt()).toEqual(completionDate);
        expect(() => stage.complete(new Date())).toThrow(ConflictError);
    });

    it('updates an existing stage and rejects missing stages', async () => {
        const repository = new FakeTreatmentStageRepository([
            TreatmentStage.create({ id: 'stage-1', planId: 'plan-1', name: 'Consultation', sequence: 1 })
        ]);
        const usecase = new UpdateTreatmentStageUsecase(repository);

        const updated = await usecase.execute({ id: 'stage-1', name: 'Follow-up exam', notes: 'Check healing' });

        expect(updated.getName()).toBe('Follow-up exam');
        expect(updated.getNotes()).toBe('Check healing');
        await expect(usecase.execute({ id: 'missing', name: 'Updated' })).rejects.toThrow(NotFoundError);
    });

    it('deletes active stages and rejects missing or completed ones', async () => {
        const repository = new FakeTreatmentStageRepository([
            TreatmentStage.create({ id: 'active-stage', planId: 'plan-1', name: 'Consultation', sequence: 1 }),
            TreatmentStage.create({
                id: 'completed-stage',
                planId: 'plan-1',
                name: 'X-ray',
                sequence: 2,
                completed: true,
                completedAt: new Date('2026-01-20T00:00:00Z')
            })
        ]);
        const usecase = new DeleteTreatmentStageUsecase(repository);

        await expect(usecase.execute('active-stage')).resolves.toBeUndefined();
        await expect(usecase.execute('missing')).rejects.toThrow(NotFoundError);
        await expect(usecase.execute('completed-stage')).rejects.toThrow(ConflictError);
    });
});