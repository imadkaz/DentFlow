// src/models/Appointment.test.ts
import { describe, it, expect } from 'vitest';
import { Appointment, AppointmentStatus } from '../Appointment.model';

describe('Appointment', () => {
    it('creates an appointment with defaults', () => {
        const appt = Appointment.create({
            id: '1', patientId: 'p1', doctorId: 'd1', procedure: 'Cleaning',
            apptDate: new Date('2026-10-01'), apptTime: new Date('2026-10-01T09:00:00'),
        });
        expect(appt.getStatus()).toBe(AppointmentStatus.PENDING);
        expect(appt.getDurationMin()).toBe(30);
        expect(appt.getNotes()).toBeNull();
    });

    it('throws when procedure is empty', () => {
        expect(() => Appointment.create({
            id: '1', patientId: 'p1', doctorId: 'd1', procedure: '',
            apptDate: new Date(), apptTime: new Date(),
        })).toThrow('Appointment procedure is required');
    });

    it('throws when durationMin is zero or negative', () => {
        expect(() => Appointment.create({
            id: '1', patientId: 'p1', doctorId: 'd1', procedure: 'Cleaning',
            apptDate: new Date(), apptTime: new Date(), durationMin: 0,
        })).toThrow('Appointment duration must be greater than zero');
    });
});