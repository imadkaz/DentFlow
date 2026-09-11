// import { describe, expect, it } from 'vitest';
// import { Doctor } from '../../models/Doctor.model';
// import { Clinic } from '../../models/Clinic.model';
// import { User } from '../../models/User.model';
// import { IClinicRepository } from '../../repository/interfaces/IClinicRepository';
// import { IDoctorRepository } from '../../repository/interfaces/IDoctorRepository';
// import { IUserRepository } from '../../repository/interfaces/IUserRepository';
// import { CreateDoctorUsecase } from './CreateDoctorUsecase';
// import { UpdateDoctorUsecase } from './UpdateDoctorUsecase';

// class FakeDoctorRepository implements IDoctorRepository {
//     readonly doctors = new Map<string, Doctor>();
//     async findById(id: string) { return this.doctors.get(id) ?? null; }
//     async findByLicenseNo(licenseNo: string) {
//         return [...this.doctors.values()].find((doctor) => doctor.getLicenseNo() === licenseNo) ?? null;
//     }
//     async findByEmail(email: string) {
//         return [...this.doctors.values()].find((doctor) => doctor.getEmail() === email) ?? null;
//     }
//     async findByUserId(userId: string) {
//         return [...this.doctors.values()].find((doctor) => doctor.getUserId() === userId) ?? null;
//     }
//     async save(doctor: Doctor) { this.doctors.set(doctor.getId(), doctor); return doctor; }
//     async update(doctor: Doctor) { this.doctors.set(doctor.getId(), doctor); return doctor; }
//     async delete(id: string) { this.doctors.delete(id); }
// }

// class FakeClinicRepository implements IClinicRepository {
//     readonly clinics = new Map<string, Clinic>();
//     async findById(id: string) { return this.clinics.get(id) ?? null; }
//     async findByEmail(email: string) {
//         return [...this.clinics.values()].find((clinic) => clinic.getEmail() === email) ?? null;
//     }
//     async save(clinic: Clinic) { this.clinics.set(clinic.getId(), clinic); return clinic; }
//     async update(clinic: Clinic) { this.clinics.set(clinic.getId(), clinic); return clinic; }
//     async delete(id: string) { this.clinics.delete(id); }
// }

// class FakeUserRepository implements IUserRepository {
//     readonly users = new Map<string, User>();
//     async findById(id: string) { return this.users.get(id) ?? null; }
//     async findByEmail(email: string) {
//         return [...this.users.values()].find((user) => user.getEmail() === email) ?? null;
//     }
//     async save(user: User) { this.users.set(user.getId(), user); return user; }
//     async update(user: User) { this.users.set(user.getId(), user); return user; }
//     async delete(id: string) { this.users.delete(id); }
// }

// function setup() {
//     const doctors = new FakeDoctorRepository();
//     const clinics = new FakeClinicRepository();
//     const users = new FakeUserRepository();
//     clinics.clinics.set('clinic-id', Clinic.create({ id: 'clinic-id', name: 'Smile Dental' }));
//     users.users.set('user-id', User.create({
//         id: 'user-id', firstName: 'Maya', lastName: 'Haddad', email: 'maya.user@example.com', passwordHash: 'hash',
//     }));
//     return { doctors, clinics, users };
// }

// const input = { clinicId: 'clinic-id', userId: 'user-id', name: 'Dr. Maya Haddad', licenseNo: 'LB-12345' };

// describe('Doctor use cases', () => {
//     it('creates a doctor only when its clinic and user exist', async () => {
//         const { doctors, clinics, users } = setup();
//         const doctor = await new CreateDoctorUsecase(doctors, clinics, users).execute(input);

//         expect(doctor.getId()).toBeTruthy();
//         expect(await doctors.findById(doctor.getId())).toBe(doctor);
//     });

//     it('rejects a doctor for a missing clinic', async () => {
//         const { doctors, clinics, users } = setup();
//         await expect(new CreateDoctorUsecase(doctors, clinics, users).execute({ ...input, clinicId: 'missing' }))
//             .rejects.toThrow('Clinic not found');
//     });

//     it('rejects reuse of a doctor license number', async () => {
//         const { doctors, clinics, users } = setup();
//         const usecase = new CreateDoctorUsecase(doctors, clinics, users);
//         await usecase.execute(input);
//         users.users.set('second-user-id', User.create({
//             id: 'second-user-id', firstName: 'Nadim', lastName: 'Karam', email: 'nadim@example.com', passwordHash: 'hash',
//         }));

//         await expect(usecase.execute({ ...input, userId: 'second-user-id' }))
//             .rejects.toThrow('A doctor with this license number already exists');
//     });

//     it('updates the profile without changing the linked clinic or user', async () => {
//         const { doctors, clinics, users } = setup();
//         const created = await new CreateDoctorUsecase(doctors, clinics, users).execute(input);

//         const updated = await new UpdateDoctorUsecase(doctors).execute({
//             id: created.getId(), specialty: 'Orthodontics', phone: '+961 70 123 456',
//         });

//         expect(updated.getClinicId()).toBe('clinic-id');
//         expect(updated.getUserId()).toBe('user-id');
//         expect(updated.getSpecialty()).toBe('Orthodontics');
//     });
// });
