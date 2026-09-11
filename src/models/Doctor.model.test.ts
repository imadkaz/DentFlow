// import { describe, expect, it } from 'vitest';
// import { Doctor } from './Doctor.model';

// const validDoctor = {
//     id: 'doctor-id',
//     clinicId: 'clinic-id',
//     userId: 'user-id',
//     name: 'Dr. Maya Haddad',
//     licenseNo: 'LB-12345',
// };

// describe('Doctor', () => {
//     it('creates a doctor with required fields', () => {
//         const doctor = Doctor.create(validDoctor);

//         expect(doctor.getName()).toBe('Dr. Maya Haddad');
//         expect(doctor.getClinicId()).toBe('clinic-id');
//         expect(doctor.getUserId()).toBe('user-id');
//         expect(doctor.getSpecialty()).toBeNull();
//     });

//     it('trims text fields', () => {
//         const doctor = Doctor.create({
//             ...validDoctor,
//             name: '  Dr. Maya Haddad  ',
//             specialty: '  Orthodontics  ',
//             licenseNo: '  LB-12345  ',
//         });

//         expect(doctor.getName()).toBe('Dr. Maya Haddad');
//         expect(doctor.getSpecialty()).toBe('Orthodontics');
//         expect(doctor.getLicenseNo()).toBe('LB-12345');
//     });

//     it.each([
//         ['clinicId', 'Clinic ID is required'],
//         ['userId', 'User ID is required'],
//         ['name', 'Doctor name is required'],
//         ['licenseNo', 'Doctor license number is required'],
//     ] as const)('rejects a missing %s', (field, message) => {
//         expect(() => Doctor.create({ ...validDoctor, [field]: '   ' })).toThrow(message);
//     });

//     it('rejects a name longer than 120 characters', () => {
//         expect(() => Doctor.create({ ...validDoctor, name: 'a'.repeat(121) }))
//             .toThrow('Doctor name must be at most 120 characters');
//     });

//     it('updates profile fields without changing clinic or user ownership', () => {
//         const doctor = Doctor.create(validDoctor);

//         doctor.updateProfile({
//             name: 'Dr. Maya H.',
//             specialty: 'General Dentistry',
//             licenseNo: 'LB-54321',
//             phone: '+961 70 123 456',
//             email: 'maya@example.com',
//         });

//         expect(doctor.getClinicId()).toBe('clinic-id');
//         expect(doctor.getUserId()).toBe('user-id');
//         expect(doctor.getSpecialty()).toBe('General Dentistry');
//         expect(doctor.getLicenseNo()).toBe('LB-54321');
//     });
// });
