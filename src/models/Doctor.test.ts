import { describe, it, expect } from 'vitest';
import { Doctor } from './Doctor.model';

describe('Doctor', () => {
    it('creates a valid doctor', () => {
        const doctor = Doctor.create({
            id: '1', clinicId: 'c1', userId: 'u1', name: 'Dr. Layla', licenseNo: 'LIC-001',
            createdAt: new Date()
        });
        expect(doctor.getName()).toBe('Dr. Layla');
        expect(doctor.getSpecialty()).toBeNull();
    });

    it('throws when name is empty', () => {
        expect(() => Doctor.create({
            id: '1', clinicId: 'c1', userId: 'u1', name: '', licenseNo: 'LIC-001',
            createdAt: new Date()
        }))
            .toThrow();
    });
});