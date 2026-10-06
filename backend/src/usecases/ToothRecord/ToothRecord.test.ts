import { describe, it, expect, beforeEach } from 'vitest';
import { UpsetToothRecordUsecase } from './UpsetToothRecordUsecase';
import { ToothRecord, ToothStatus } from '../../models/ToothRecord.model';
import { IToothRecordRepository } from '../../repository/interfaces/IToothRecordRepository';
import { IPatientRepository } from '../../repository/interfaces/IPatientRepository';
import { Patient } from '../../models/Patient.model';

class FakeToothRepository implements IToothRecordRepository {
    private records = new Map<string, ToothRecord>();
    async findById(id: string) { return this.records.get(id) ?? null; }
    async findByPatientAndTooth(patientId: string, toothNumber: number) {
        return [...this.records.values()].find(r => r.getPatientId() === patientId && r.getToothNumber() === toothNumber) ?? null;
    }
    async findByPatientId(patientId: string) { return [...this.records.values()].filter(r => r.getPatientId() === patientId); }
    async save(r: ToothRecord) { this.records.set(r.getId(), r); return r; }
    async update(r: ToothRecord) { this.records.set(r.getId(), r); return r; }
    async delete(id: string) { this.records.delete(id); }
}

class FakePatientRepository implements IPatientRepository {
    constructor(private patient: Patient | null) { }

    findByClinicId(_clinicId: string): Promise<Patient[]> {
        return Promise.resolve(this.patient?.getClinicId() === _clinicId ? [this.patient] : []);
    }
    async findById(id: string) { return this.patient?.getId() === id ? this.patient : null; }
    async findByName() { return []; }
    async save(p: Patient) { return p; }
    async update(p: Patient) { return p; }
    async delete() { }
}

describe('UpsertToothRecordUsecase', () => {
    let patient: Patient;
    let toothRepository: FakeToothRepository;
    let useCase: UpsetToothRecordUsecase;

    beforeEach(() => {
        patient = Patient.create({ id: 'p1', clinicId: 'c1', name: 'Ahmad', initials: 'AHK' });
        toothRepository = new FakeToothRepository();
        useCase = new UpsetToothRecordUsecase(toothRepository, new FakePatientRepository(patient));
    });

    it('creates a new tooth record when none exists', async () => {
        const record = await useCase.execute({ patientId: 'p1', toothNumber: 14, status: ToothStatus.TREATMENT_NEEDED });
        expect(record.getStatus()).toBe(ToothStatus.TREATMENT_NEEDED);
    });

    it('updates the existing record instead of creating a duplicate', async () => {
        await useCase.execute({ patientId: 'p1', toothNumber: 14, status: ToothStatus.TREATMENT_NEEDED });
        const updated = await useCase.execute({ patientId: 'p1', toothNumber: 14, status: ToothStatus.COMPLETED });

        const all = await toothRepository.findByPatientId('p1');
        expect(all.length).toBe(1);   // ✅ ما تعدّدت، تحدّثت
        expect(updated.getStatus()).toBe(ToothStatus.COMPLETED);
    });

    it('throws when tooth number is out of range', async () => {
        await expect(useCase.execute({ patientId: 'p1', toothNumber: 33 })).rejects.toThrow('between 1 and 32');
    });
});