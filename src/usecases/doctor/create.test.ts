import { describe, it, expect, beforeEach } from 'vitest';
import { CreateDoctorUsecase } from './CreateDoctorUsecase';
import { IDoctorRepository } from '../../repository/interfaces/IDoctorRepository';
import { IClinicRepository } from '../../repository/interfaces/IClinicRepository';
import { IUserRepository } from '../../repository/interfaces/IUserRepository';
import { Doctor } from '../../models/Doctor.model';
import { Clinic } from '../../models/Clinic.model';
import { User } from '../../models/User.model';

class FakeDoctorRepository implements IDoctorRepository {
    private doctors = new Map<string, Doctor>();
    async findById(id: string) { return this.doctors.get(id) ?? null; }
    async findByEmail() { return null; }
    async findByLicenseNo(licenseNo: string) {
        return [...this.doctors.values()].find(d => d.getLicenseNo() === licenseNo) ?? null;
    }
    async findByUserId() { return null; }
    async save(d: Doctor) { this.doctors.set(d.getId(), d); return d; }
    async update(d: Doctor) { this.doctors.set(d.getId(), d); return d; }
    async delete(id: string) { this.doctors.delete(id); }
}

class FakeClinicRepository implements IClinicRepository {
    constructor(private clinic: Clinic | null) {}
    async findById(id: string) { return this.clinic?.getId() === id ? this.clinic : null; }
    async findByEmail() { return null; }
    async save(c: Clinic) { return c; }
    async update(c: Clinic) { return c; }
    async delete() {}
}

class FakeUserRepository implements IUserRepository {
    constructor(private user: User | null) {}
    async findById(id: string) { return this.user?.getId() === id ? this.user : null; }
    async findByEmail() { return null; }
    async save(u: User) { return u; }
    async update(u: User) { return u; }
    async delete() {}
}

describe('CreateDoctorUsecase', () => {
    let clinic: Clinic;
    let user: User;
    let doctorRepository: FakeDoctorRepository;
    let useCase: CreateDoctorUsecase;

    beforeEach(() => {
        clinic = Clinic.create({ id: 'clinic-1', name: 'Smile Dental' });
        user = User.create({
            id: 'user-1', firstName: 'Layla', lastName: 'Aoun',
            email: 'layla@example.com', passwordHash: 'hashed',
        });
        doctorRepository = new FakeDoctorRepository();
        useCase = new CreateDoctorUsecase(
            doctorRepository,
            new FakeClinicRepository(clinic),
            new FakeUserRepository(user),
        );
    });

    it('creates a doctor when clinic and user exist', async () => {
        const doctor = await useCase.execute({
            clinicId: 'clinic-1', userId: 'user-1', name: 'Dr. Layla', licenseNo: 'LIC-001',
            createdAt: new Date()
        });
        expect(doctor.getName()).toBe('Dr. Layla');
    });

    it('throws when the clinic does not exist', async () => {
        await expect(useCase.execute({
            clinicId: 'missing', userId: 'user-1', name: 'Dr. Layla', licenseNo: 'LIC-001',
            createdAt: new Date()
        })).rejects.toThrow('Clinic not found');
    });

    it('throws when the user does not exist', async () => {
        await expect(useCase.execute({
            clinicId: 'clinic-1', userId: 'missing', name: 'Dr. Layla', licenseNo: 'LIC-001',
            createdAt: new Date()
        })).rejects.toThrow('User not found');
    });

    it('throws when license number already exists', async () => {
        await useCase.execute({
            clinicId: 'clinic-1', userId: 'user-1', name: 'Dr. A', licenseNo: 'LIC-001',
            createdAt: new Date()
        });
        await expect(useCase.execute({
            clinicId: 'clinic-1', userId: 'user-1', name: 'Dr. B', licenseNo: 'LIC-001',
            createdAt: new Date()
        })).rejects.toThrow('already exists');
    });
});