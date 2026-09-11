import { Doctor } from '../../models/Doctor.model';
import { IRepository } from './IRepository';

export interface IDoctorRepository extends IRepository<Doctor> {
    findByLicenseNo(licenseNo: string): Promise<Doctor | null>;
    findByEmail(email: string): Promise<Doctor | null>;
    findByUserId(userId: string): Promise<Doctor | null>;
}
