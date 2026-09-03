import { Clinic } from '../models/Clinic.model';

export interface IClinicRepository {
    findById(id: string): Promise<Clinic | null>;
    findByEmail(email: string): Promise<Clinic | null>;
    save(clinic: Clinic): Promise<Clinic>;
    update(clinic: Clinic): Promise<Clinic>;
    delete(id: string): Promise<void>;
}