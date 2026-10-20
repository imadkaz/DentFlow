import { Doctor } from '../src/models/Doctor.model';
import { Patient } from '../src/models/Patient.model';
import { PlanStatus, TreatmentPlan } from '../src/models/TreatmentPlan.model';
import { IDoctorRepository } from '../src/repository/interfaces/IDoctorRepository';
import { IPatientRepository } from '../src/repository/interfaces/IPatientRepository';
import { ITreatmentPlanRepository } from '../src/repository/interfaces/ITreatmentPlanRepository';

export class FakeTreatmentPlanRepository implements ITreatmentPlanRepository {
    readonly items = new Map<string, TreatmentPlan>();

    async findById(id: string) { return this.items.get(id) ?? null; }
    async save(plan: TreatmentPlan) { this.items.set(plan.getId(), plan); return plan; }
    async update(plan: TreatmentPlan) { this.items.set(plan.getId(), plan); return plan; }
    async delete(id: string) { this.items.delete(id); }
    async findActiveByPatient(patientId: string) {
        return [...this.items.values()].find(plan => plan.getPatientId() === patientId && plan.getStatus() === PlanStatus.ACTIVE) ?? null;
    }
    async findByPatientId(patientId: string) {
        return [...this.items.values()].filter(plan => plan.getPatientId() === patientId);
    }
}

export class FakePatientRepository implements IPatientRepository {
    constructor(private readonly patients: Patient[] = []) {}

    async findById(id: string) { return this.patients.find(patient => patient.getId() === id) ?? null; }
    async save(patient: Patient) { this.patients.push(patient); return patient; }
    async update(patient: Patient) { return patient; }
    async delete(id: string) {
        const index = this.patients.findIndex(patient => patient.getId() === id);
        if (index !== -1) this.patients.splice(index, 1);
    }
    async findByName(name: string) {
        return this.patients.filter(patient => patient.getName().toLowerCase().includes(name.toLowerCase()));
    }
    async findByClinicId(clinicId: string) {
        return this.patients.filter(patient => patient.getClinicId() === clinicId);
    }
}

export class FakeDoctorRepository implements IDoctorRepository {
    constructor(private readonly doctors: Doctor[] = []) {}

    async findById(id: string) { return this.doctors.find(doctor => doctor.getId() === id) ?? null; }
    async save(doctor: Doctor) { this.doctors.push(doctor); return doctor; }
    async update(doctor: Doctor) { return doctor; }
    async delete(id: string) {
        const index = this.doctors.findIndex(doctor => doctor.getId() === id);
        if (index !== -1) this.doctors.splice(index, 1);
    }
    async findByLicenseNo(licenseNo: string) {
        return this.doctors.find(doctor => doctor.getLicenseNo() === licenseNo) ?? null;
    }
    async findByEmail(email: string) {
        return this.doctors.find(doctor => doctor.getEmail() === email) ?? null;
    }
    async findByUserId(userId: string) {
        return this.doctors.find(doctor => doctor.getUserId() === userId) ?? null;
    }
    async findByClinicId(clinicId: string) {
        return this.doctors.filter(doctor => doctor.getClinicId() === clinicId);
    }
}
