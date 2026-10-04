// src/usecases/Appointment/UpdateAppointmentUsecase.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateAppointmentUsecase } from './UpdateAppointmentUsecase';
import { Appointment } from '../../models/Appointment.model';
import { IAppointmentRepository } from '../../repository/interfaces/IAppointmentRepository';

class FakeAppointmentRepository implements IAppointmentRepository {
    findByDoctorAndDate(doctorId: string, apptDate: Date): Promise<Appointment[]> {
        const requestedDate = apptDate.toDateString();
        return Promise.resolve(
            Array.from(this.items.values()).filter(appointment =>
                appointment.getDoctorId() === doctorId &&
                appointment.getApptDate().toDateString() === requestedDate,
            ),
        );
    }
    async findByPatientId(patientId: string): Promise<Appointment[]> {
        return Array.from(this.items.values()).filter(appointment => appointment.getPatientId() === patientId);
    }
    async findByDoctorId(doctorId: string): Promise<Appointment[]> {
        return Array.from(this.items.values()).filter(appointment => appointment.getDoctorId() === doctorId);
    }
    private items = new Map<string, Appointment>();
    seed(a: Appointment) { this.items.set(a.getId(), a); }
    async findById(id: string) { return this.items.get(id) ?? null; }
    async save(a: Appointment) { this.items.set(a.getId(), a); return a; }
    async update(a: Appointment) { this.items.set(a.getId(), a); return a; }
    async delete(id: string) { this.items.delete(id); }
}

describe('UpdateAppointmentUsecase', () => {
    let repository: FakeAppointmentRepository;
    let useCase: UpdateAppointmentUsecase;
    let existing: Appointment;

    beforeEach(() => {
        existing = Appointment.create({
            id: 'a1', patientId: 'p1', doctorId: 'd1', procedure: 'Cleaning',
            apptDate: new Date(), apptTime: new Date(), notes: 'Original note',
        });
        repository = new FakeAppointmentRepository();
        repository.seed(existing);
        useCase = new UpdateAppointmentUsecase(repository);
    });

    it('calls update, not save, on the repository', async () => {
        // هون الاختبار الأهم — يوثّق الـ bug الأصلي (save بدل update)
        const result = await useCase.execute({ id: 'a1', procedure: 'X-Ray' });
        expect(result.getProcedure()).toBe('X-Ray');
    });

    it('preserves notes when not included in the update', async () => {
        const result = await useCase.execute({ id: 'a1', procedure: 'X-Ray' });
        expect(result.getNotes()).toBe('Original note');   // ✅ يوثّق تصحيح bug مسح الـ notes
    });

    it('throws when appointment does not exist', async () => {
        await expect(useCase.execute({ id: 'missing', procedure: 'X-Ray' }))
            .rejects.toThrow('Appointment not found');
    });
});