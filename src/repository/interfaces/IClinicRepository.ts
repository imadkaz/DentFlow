import { Clinic } from '../../models/Clinic.model';
import { IRepository } from './IRepository';

export interface IClinicRepository extends IRepository<Clinic> {
    findByEmail(email: string): Promise<Clinic | null>;
}