import { describe, it, expect } from 'vitest';
import { Patient, PatientStatus } from './Patient.model';

describe('Patient', () => {
    it('creates a patient with defaults when optional fields are omitted', () => {
        const patient = Patient.create({
            id: '1', clinicId: 'c1', name: 'Ahmad Khalil', initials: 'AHK',
        });

        expect(patient.getStatus()).toBe(PatientStatus.NEW);
        expect(patient.getBalance()).toBe(0);
        expect(patient.getTotalVisits()).toBe(0);
        expect(patient.getEmail()).toBeNull();
    });

    it('throws when name is empty', () => {
        expect(() => Patient.create({ id: '1', clinicId: 'c1', name: '', initials: 'AHK' }))
            .toThrow('Patient name is required');
    });

    it('throws when initials are not exactly 3 characters', () => {
        expect(() => Patient.create({ id: '1', clinicId: 'c1', name: 'Ahmad', initials: 'AH' }))
            .toThrow('Patient initials must be exactly 3 characters');
    });

    it('accepts a custom status', () => {
        const patient = Patient.create({
            id: '1', clinicId: 'c1', name: 'Ahmad', initials: 'AHK', status: PatientStatus.ACTIVE,
        });
        expect(patient.getStatus()).toBe(PatientStatus.ACTIVE);
    });
});