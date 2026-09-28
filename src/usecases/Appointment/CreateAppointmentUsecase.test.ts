// src/usecases/Appointment/CreateAppointmentUsecase.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateAppointmentUsecase } from './CreateAppointmentUsecase';
import { Appointment } from '../../models/Appointment.model';
import { IAppointmentRepository } from '../../repository/interfaces/IAppointmentRepository';
import { IPatientRepository } from '../../repository/interfaces/IPatientRepository';
import { IDoctorRepository } from '../../repository/interfaces/IDoctorRepository';
import { Patient } from '../../models/Patient.model';
import { Doctor } from '../../models/Doctor.model';

class FakeAppointmentRepository implements IAppointmentRepository {
    private items = new Map<string, Appointment>();
    async findByPatientId(patientId: string): Promise<Appointment[]> {
        return [...this.items.values()].filter(appointment => appointment.getPatientId() === patientId);
    }
    async findByDoctorId(doctorId: string): Promise<Appointment[]> {
        return [...this.items.values()].filter(appointment => appointment.getDoctorId() === doctorId);
    }
    async findById(id: string) { return this.items.get(id) ?? null; }
    async save(a: Appointment) { this.items.set(a.getId(), a); return a; }
    async update(a: Appointment) { this.items.set(a.getId(), a); return a; }
    async delete(id: string) { this.items.delete(id); }

}

class FakePatientRepository implements IPatientRepository {
    constructor(private patient: Patient | null) { }
    findByClinicId(clinicId: string): Promise<Patient[]> {
        return Promise.resolve(this.patient?.getClinicId() === clinicId ? [this.patient] : []);
    }
    async findById(id: string) { return this.patient?.getId() === id ? this.patient : null; }
    async findByName() { return []; }
    async save(p: Patient) { return p; }
    async update(p: Patient) { return p; }
    async delete() { }
}

class FakeDoctorRepository implements IDoctorRepository {
    constructor(private doctor: Doctor | null) { }
    async findByClinicId(clinicId: string): Promise<Doctor[]> {
        return this.doctor?.getClinicId() === clinicId ? [this.doctor] : [];
    }
    async findById(id: string) { return this.doctor?.getId() === id ? this.doctor : null; }
    async findByEmail() { return null; }
    async findByLicenseNo() { return null; }
    async findByUserId() { return null; }
    async save(d: Doctor) { return d; }
    async update(d: Doctor) { return d; }
    async delete() { }
}

describe('CreateAppointmentUsecase', () => {
    let patient: Patient;
    let doctor: Doctor;
    let useCase: CreateAppointmentUsecase;

    beforeEach(() => {
        patient = Patient.create({ id: 'p1', clinicId: 'c1', name: 'Ahmad', initials: 'AHK' });
        doctor = Doctor.create({ id: 'd1', clinicId: 'c1', userId: 'u1', name: 'Dr. Layla', licenseNo: 'LIC-1', createdAt: new Date() });
        useCase = new CreateAppointmentUsecase(
            new FakeAppointmentRepository() as unknown as import('../../repository/AppointmentRepository').AppointmentRepository,
            new FakePatientRepository(patient) as unknown as import('../../repository/PatientRepository').PatientRepository,
            new FakeDoctorRepository(doctor) as unknown as import('../../repository/DoctorRepository').DoctorRepository,
        );
    });

    it('creates an appointment when patient and doctor exist', async () => {
        const appt = await useCase.execute({
            patientId: 'p1', doctorId: 'd1', procedure: 'Cleaning',
            apptDate: new Date(), apptTime: new Date(), durationMin: 30,
        });
        expect(appt.getProcedure()).toBe('Cleaning');
    });

    it('throws when patient does not exist', async () => {
        await expect(useCase.execute({
            patientId: 'missing', doctorId: 'd1', procedure: 'Cleaning',
            apptDate: new Date(), apptTime: new Date(), durationMin: 30,
        })).rejects.toThrow('Patient not found');
    });

    it('throws when doctor does not exist', async () => {
        await expect(useCase.execute({
            patientId: 'p1', doctorId: 'missing', procedure: 'Cleaning',
            apptDate: new Date(), apptTime: new Date(), durationMin: 30,
        })).rejects.toThrow('Doctor not found');
    });
});