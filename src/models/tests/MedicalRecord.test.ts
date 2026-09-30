// src/__tests__/medicalRecord.test.ts
import { afterEach, describe, expect, it, vi as jest } from 'vitest';
import { BloodType, MedicalRecord } from '../../models/MedicalRecord.model';
import { MedicalRecordMapper } from '../../mapper/MedicalRecord.mapper';
import { MedicalRecordRepository } from '../../repository/MedicalRecordRepository';
import { CreateMedialUsecase } from '../../usecases/MedicalRecord/CreateMedicalUsecase';
import { UpdateMedicalUsecase } from '../../usecases/MedicalRecord/UpdateMedicalUsecase';
import { DeleteMedicalUsecase } from '../../usecases/MedicalRecord/DeleteMedicalUsecase';
import { GetMedicalUsecase } from '../../usecases/MedicalRecord/getMedicalUsecase';
import { GetPatientMedicalUsecase } from '../../usecases/MedicalRecord/GetPatientMedicalUsecase';
import { MedicalController } from '../../Controllers/MedicalController';
import { NotFoundError } from '../../util/exceptions/http/NotFoundError';

// ---------- helpers ----------

const makeRecord = (overrides: Partial<Parameters<typeof MedicalRecord.create>[0]> = {}) =>
    MedicalRecord.create({
        id: 'rec-1',
        patientId: 'pat-1',
        allergies: ['peanuts'],
        conditions: ['asthma'],
        medications: ['ventolin'],
        bloodType: BloodType.O_NEGATIVE,
        notes: 'initial note',
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        ...overrides,
    });

const makeMedicalRepo = () => ({
    findById: jest.fn(),
    findByPatient: jest.fn(),
    save: jest.fn(async (r: MedicalRecord) => r),
    update: jest.fn(async (r: MedicalRecord) => r),
    delete: jest.fn(),
});

const makePatientRepo = () => ({ findById: jest.fn() });

const asRepo = (r: unknown) => r as MedicalRecordRepository;

// ---------- MedicalRecord model ----------

describe('MedicalRecord model', () => {
    it('defaults collections to empty arrays and notes to null', () => {
        const r = MedicalRecord.create({ id: 'a', patientId: 'p' });
        expect(r.getAllergies()).toEqual([]);
        expect(r.getConditions()).toEqual([]);
        expect(r.getMedications()).toEqual([]);
        expect(r.getNotes()).toBeNull();
    });

    it('does NOT invent a blood type when none is provided', () => {
        const r = MedicalRecord.create({ id: 'a', patientId: 'p' });
        expect(r.getBloodType()).toBeNull();
    });

    it('keeps provided values', () => {
        const r = makeRecord();
        expect(r.getId()).toBe('rec-1');
        expect(r.getPatientId()).toBe('pat-1');
        expect(r.getBloodType()).toBe(BloodType.O_NEGATIVE);
        expect(r.getUpdatedAt()).toEqual(new Date('2024-01-01T00:00:00Z'));
    });
});

// ---------- Mapper ----------

describe('MedicalRecordMapper', () => {
    const raw = {
        id: 'rec-1',
        patientId: 'pat-1',
        allergies: ['dust'],
        conditions: [],
        medications: ['aspirin'],
        bloodType: 'AB+',
        notes: null,
        updatedAt: new Date('2024-02-02T00:00:00Z'),
    };

    it('toDomain maps every field', () => {
        const d = MedicalRecordMapper.toDomain(raw);
        expect(d.getId()).toBe('rec-1');
        expect(d.getPatientId()).toBe('pat-1');
        expect(d.getAllergies()).toEqual(['dust']);
        expect(d.getMedications()).toEqual(['aspirin']);
        expect(d.getBloodType()).toBe(BloodType.AB_POSITIVE);
        expect(d.getNotes()).toBeNull();
    });

    it('toPersistence round-trips with toDomain', () => {
        const record = makeRecord();
        const persisted = MedicalRecordMapper.toPersistence(record);
        expect(persisted).toEqual({
            id: 'rec-1',
            patientId: 'pat-1',
            allergies: ['peanuts'],
            conditions: ['asthma'],
            medications: ['ventolin'],
            bloodType: BloodType.O_NEGATIVE,
            notes: 'initial note',
            updatedAt: new Date('2024-01-01T00:00:00Z'),
        });
    });
});

// ---------- Repository ----------

describe('MedicalRecordRepository', () => {
    const rawRow = {
        id: 'rec-1',
        patientId: 'pat-1',
        allergies: [],
        conditions: [],
        medications: [],
        bloodType: 'O-',
        notes: null,
        updatedAt: new Date(),
    };

    const makePrisma = () => ({
        medicalRecord: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    });

    it('findById returns a domain object or null', async () => {
        const prisma = makePrisma();
        const repo = new MedicalRecordRepository(
            prisma as unknown as ConstructorParameters<typeof MedicalRecordRepository>[0],
        );

        prisma.medicalRecord.findUnique.mockResolvedValueOnce(rawRow);
        expect((await repo.findById('rec-1'))?.getId()).toBe('rec-1');
        expect(prisma.medicalRecord.findUnique).toHaveBeenCalledWith({ where: { id: 'rec-1' } });

        prisma.medicalRecord.findUnique.mockResolvedValueOnce(null);
        expect(await repo.findById('nope')).toBeNull();
    });

    it('findByPatient queries by patientId (not by record id)', async () => {
        const prisma = makePrisma();
        prisma.medicalRecord.findUnique.mockResolvedValue(rawRow);
        prisma.medicalRecord.findFirst.mockResolvedValue(rawRow);
        const repo = new MedicalRecordRepository(
            prisma as unknown as ConstructorParameters<typeof MedicalRecordRepository>[0],
        );

        await repo.findByPatient('pat-1');

        const call =
            prisma.medicalRecord.findFirst.mock.calls[0]?.[0] ??
            prisma.medicalRecord.findUnique.mock.calls[0]?.[0];
        expect(call.where).toEqual({ patientId: 'pat-1' });
    });

    it('save persists and maps the result', async () => {
        const prisma = makePrisma();
        prisma.medicalRecord.create.mockResolvedValue(rawRow);
        const repo = new MedicalRecordRepository(
            prisma as unknown as ConstructorParameters<typeof MedicalRecordRepository>[0],
        );

        const saved = await repo.save(makeRecord());
        expect(prisma.medicalRecord.create).toHaveBeenCalledTimes(1);
        expect(saved.getId()).toBe('rec-1');
    });

    it('update targets the record id', async () => {
        const prisma = makePrisma();
        prisma.medicalRecord.update.mockResolvedValue(rawRow);
        const repo = new MedicalRecordRepository(
            prisma as unknown as ConstructorParameters<typeof MedicalRecordRepository>[0],
        );

        await repo.update(makeRecord());
        expect(prisma.medicalRecord.update).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: 'rec-1' } }),
        );
    });

    it('delete removes by id', async () => {
        const prisma = makePrisma();
        const repo = new MedicalRecordRepository(
            prisma as unknown as ConstructorParameters<typeof MedicalRecordRepository>[0],
        );

        await repo.delete('rec-1');
        expect(prisma.medicalRecord.delete).toHaveBeenCalledWith({ where: { id: 'rec-1' } });
    });
});

// ---------- CreateMedialUsecase ----------

describe('CreateMedialUsecase', () => {
    const input = {
        patientId: 'pat-1',
        allergies: ['peanuts'],
        conditions: ['asthma'],
        medications: ['ventolin'],
        bloodType: BloodType.B_POSITIVE,
        notes: 'some notes',
    };

    it('throws NotFoundError when the patient does not exist', async () => {
        const medRepo = makeMedicalRepo();
        const patientRepo = makePatientRepo();
        patientRepo.findById.mockResolvedValue(null);
        const usecase = new CreateMedialUsecase(asRepo(medRepo), patientRepo as any);

        await expect(usecase.execute(input)).rejects.toBeInstanceOf(NotFoundError);
        expect(medRepo.save).not.toHaveBeenCalled();
    });

    it('saves a record with all provided fields', async () => {
        const medRepo = makeMedicalRepo();
        const patientRepo = makePatientRepo();
        patientRepo.findById.mockResolvedValue({ id: 'pat-1' });
        const usecase = new CreateMedialUsecase(asRepo(medRepo), patientRepo as any);

        const result = await usecase.execute(input);

        expect(medRepo.save).toHaveBeenCalledTimes(1);
        expect(result.getPatientId()).toBe('pat-1');
        expect(result.getAllergies()).toEqual(['peanuts']);
        expect(result.getConditions()).toEqual(['asthma']);
        expect(result.getMedications()).toEqual(['ventolin']);
        expect(result.getBloodType()).toBe(BloodType.B_POSITIVE);
    });

    it('stores notes as notes (not as the blood type)', async () => {
        const medRepo = makeMedicalRepo();
        const patientRepo = makePatientRepo();
        patientRepo.findById.mockResolvedValue({ id: 'pat-1' });
        const usecase = new CreateMedialUsecase(asRepo(medRepo), patientRepo as any);

        const result = await usecase.execute(input);
        expect(result.getNotes()).toBe('some notes');
    });

    it('generates a unique id for each record', async () => {
        const medRepo = makeMedicalRepo();
        const patientRepo = makePatientRepo();
        patientRepo.findById.mockResolvedValue({ id: 'pat-1' });
        const usecase = new CreateMedialUsecase(asRepo(medRepo), patientRepo as any);

        const a = await usecase.execute(input);
        const b = await usecase.execute(input);
        expect(a.getId()).toBeTruthy();
        expect(a.getId()).not.toBe(b.getId());
    });

    it('leaves blood type null when not provided', async () => {
        const medRepo = makeMedicalRepo();
        const patientRepo = makePatientRepo();
        patientRepo.findById.mockResolvedValue({ id: 'pat-1' });
        const usecase = new CreateMedialUsecase(asRepo(medRepo), patientRepo as any);

        const result = await usecase.execute({ ...input, bloodType: undefined });
        expect(result.getBloodType()).toBeNull();
    });
});

// ---------- UpdateMedicalUsecase ----------

describe('UpdateMedicalUsecase', () => {
    afterEach(() => jest.useRealTimers());

    it('throws NotFoundError when the record does not exist', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(null);
        const usecase = new UpdateMedicalUsecase(asRepo(repo));

        await expect(
            usecase.execute({ id: 'x'}),
        ).rejects.toBeInstanceOf(NotFoundError);
        expect(repo.update).not.toHaveBeenCalled();
    });

    it('only changes provided fields and keeps the rest', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(makeRecord());
        const usecase = new UpdateMedicalUsecase(asRepo(repo));

        const result = await usecase.execute({
            id: 'rec-1',
            allergies: ['pollen'],
        });

        expect(result.getAllergies()).toEqual(['pollen']);
        expect(result.getConditions()).toEqual(['asthma']);
        expect(result.getMedications()).toEqual(['ventolin']);
        expect(result.getBloodType()).toBe(BloodType.O_NEGATIVE);
        expect(result.getNotes()).toBe('initial note');
    });

    it('keeps id and patientId unchanged', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(makeRecord());
        const usecase = new UpdateMedicalUsecase(asRepo(repo));

        const result = await usecase.execute({ id: 'rec-1'});
        expect(result.getId()).toBe('rec-1');
        expect(result.getPatientId()).toBe('pat-1');
    });

    it('allows clearing an array with []', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(makeRecord());
        const usecase = new UpdateMedicalUsecase(asRepo(repo));

        const result = await usecase.execute({
            id: 'rec-1',
            medications: [],
        });
        expect(result.getMedications()).toEqual([]);
    });

    it('allows clearing notes with null', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(makeRecord());
        const usecase = new UpdateMedicalUsecase(asRepo(repo));

        const result = await usecase.execute({ id: 'rec-1', notes: null});
        expect(result.getNotes()).toBeNull();
    });

    it('does not turn a null blood type into a default one', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(makeRecord({ bloodType: null }));
        const usecase = new UpdateMedicalUsecase(asRepo(repo));

        const result = await usecase.execute({ id: 'rec-1', notes: 'x' });
        expect(result.getBloodType()).toBeNull();
    });

    it('sets updatedAt server-side, ignoring the client value', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2025-05-05T10:00:00Z'));
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(makeRecord());
        const usecase = new UpdateMedicalUsecase(asRepo(repo));

        const result = await usecase.execute({
            id: 'rec-1',
        });
        expect(result.getUpdatedAt()).toEqual(new Date('2025-05-05T10:00:00Z'));
    });
});

// ---------- DeleteMedicalUsecase ----------

describe('DeleteMedicalUsecase', () => {
    it('throws NotFoundError and does not delete when missing', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(null);
        const usecase = new DeleteMedicalUsecase(asRepo(repo));

        await expect(usecase.execute('x')).rejects.toBeInstanceOf(NotFoundError);
        expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deletes an existing record', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(makeRecord());
        const usecase = new DeleteMedicalUsecase(asRepo(repo));

        await usecase.execute('rec-1');
        expect(repo.delete).toHaveBeenCalledWith('rec-1');
    });
});

// ---------- GetMedicalUsecase ----------

describe('GetMedicalUsecase', () => {
    it('returns the record when found', async () => {
        const repo = makeMedicalRepo();
        const record = makeRecord();
        repo.findById.mockResolvedValue(record);

        const result = await new GetMedicalUsecase(asRepo(repo)).execute('rec-1');
        expect(result).toBe(record);
    });

    it('throws NotFoundError when missing', async () => {
        const repo = makeMedicalRepo();
        repo.findById.mockResolvedValue(null);

        await expect(new GetMedicalUsecase(asRepo(repo)).execute('x')).rejects.toBeInstanceOf(
            NotFoundError,
        );
    });
});

// ---------- GetPatientMedicalUsecase ----------

describe('GetPatientMedicalUsecase', () => {
    it('returns the patient record when found', async () => {
        const repo = makeMedicalRepo();
        const record = makeRecord();
        repo.findByPatient.mockResolvedValue(record);

        const result = await new GetPatientMedicalUsecase(asRepo(repo)).execute('pat-1');
        expect(repo.findByPatient).toHaveBeenCalledWith('pat-1');
        expect(result).toBe(record);
    });

    it('throws NotFoundError when the patient has no record', async () => {
        const repo = makeMedicalRepo();
        repo.findByPatient.mockResolvedValue(null);

        await expect(
            new GetPatientMedicalUsecase(asRepo(repo)).execute('pat-1'),
        ).rejects.toBeInstanceOf(NotFoundError);
    });
});

// ---------- MedicalController ----------

describe('MedicalController', () => {
    const makeUsecases = () => ({
        create: { execute: jest.fn() },
        update: { execute: jest.fn() },
        del: { execute: jest.fn() },
        get: { execute: jest.fn() },
        getPatient: { execute: jest.fn() },
    });

    const makeController = (u: ReturnType<typeof makeUsecases>) =>
        new MedicalController(
            u.create as any,
            u.update as any,
            u.del as any,
            u.get as any,
            u.getPatient as any,
        );

    const makeRes = () => {
        const res = {} as {
            status: ReturnType<typeof jest.fn>;
            json: ReturnType<typeof jest.fn>;
            send: ReturnType<typeof jest.fn>;
        };
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    const expected = (r: MedicalRecord) => ({
        id: r.getId(),
        patientId: r.getPatientId(),
        allergies: r.getAllergies(),
        conditions: r.getConditions(),
        medications: r.getMedications(),
        bloodType: r.getBloodType(),
        notes: r.getNotes(),
        updatedAt: r.getUpdatedAt(),
    });

    it('createMedical -> 201 with the mapped response', async () => {
        const u = makeUsecases();
        const record = makeRecord();
        u.create.execute.mockResolvedValue(record);
        const res = makeRes();
        const body = {
            patientId: 'pat-1',
            allergies: ['peanuts'],
            conditions: ['asthma'],
            medications: ['ventolin'],
            bloodType: BloodType.O_NEGATIVE,
            notes: 'n',
        };

        await makeController(u).CreateMedical(
            { body } as unknown as Parameters<MedicalController['CreateMedical']>[0],
            res as unknown as Parameters<MedicalController['CreateMedical']>[1],
        );

        expect(u.create.execute).toHaveBeenCalledWith(body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expected(record));
    });

    it('UpdateMedical uses the id from the route params', async () => {
        const u = makeUsecases();
        const record = makeRecord();
        u.update.execute.mockResolvedValue(record);
        const res = makeRes();

        await makeController(u).UpdateMedical(
            { params: { id: 'rec-1' }, body: { notes: 'changed' } } as unknown as Parameters<
                MedicalController['UpdateMedical']
            >[0],
            res as unknown as Parameters<MedicalController['UpdateMedical']>[1],
        );

        expect(u.update.execute).toHaveBeenCalledWith(expect.objectContaining({ id: 'rec-1' }));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expected(record));
    });

    it('UpdateMedical throws NotFoundError without an id', async () => {
        const u = makeUsecases();
        await expect(
            makeController(u).UpdateMedical(
                { params: {}, body: {} } as unknown as Parameters<
                    MedicalController['UpdateMedical']
                >[0],
                makeRes() as unknown as Parameters<MedicalController['UpdateMedical']>[1],
            ),
        ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('GetMedical -> 200 with the mapped response', async () => {
        const u = makeUsecases();
        const record = makeRecord();
        u.get.execute.mockResolvedValue(record);
        const res = makeRes();

        await makeController(u).GetMedical(
            { params: { id: 'rec-1' } } as unknown as Parameters<MedicalController['GetMedical']>[0],
            res as unknown as Parameters<MedicalController['GetMedical']>[1],
        );

        expect(u.get.execute).toHaveBeenCalledWith('rec-1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expected(record));
    });

    it('GetMedical throws NotFoundError without an id', async () => {
        const u = makeUsecases();
        await expect(
            makeController(u).GetMedical(
                { params: {} } as unknown as Parameters<MedicalController['GetMedical']>[0],
                makeRes() as unknown as Parameters<MedicalController['GetMedical']>[1],
            ),
        ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('GetPatientMedical reads :patientId and calls the patient use case', async () => {
        const u = makeUsecases();
        const record = makeRecord();
        u.getPatient.execute.mockResolvedValue(record);
        const res = makeRes();

        await makeController(u).GetPatientMedical(
            { params: { patientId: 'pat-1' } } as unknown as Parameters<
                MedicalController['GetPatientMedical']
            >[0],
            res as unknown as Parameters<MedicalController['GetPatientMedical']>[1],
        );

        expect(u.getPatient.execute).toHaveBeenCalledWith('pat-1');
        expect(u.get.execute).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expected(record));
    });

    it('DeleteMedical -> 204 with an empty body', async () => {
        const u = makeUsecases();
        u.del.execute.mockResolvedValue(undefined);
        const res = makeRes();

        await makeController(u).DeleteMedical(
            { params: { id: 'rec-1' } } as unknown as Parameters<MedicalController['DeleteMedical']>[0],
            res as unknown as Parameters<MedicalController['DeleteMedical']>[1],
        );

        expect(u.del.execute).toHaveBeenCalledWith('rec-1');
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('DeleteMedical throws NotFoundError without an id', async () => {
        const u = makeUsecases();
        await expect(
            makeController(u).DeleteMedical(
                { params: {} } as unknown as Parameters<MedicalController['DeleteMedical']>[0],
                makeRes() as unknown as Parameters<MedicalController['DeleteMedical']>[1],
            ),
        ).rejects.toBeInstanceOf(NotFoundError);
    });
});