import {IClinicRepository} from '../repository/IClinicRepository';
import {Clinic} from '../models/Clinic.model';
import { randomUUID } from 'node:crypto';
import logger from '../util/logger';
import { ConflictError } from '../util/exceptions/http/ConflictError';
import { NotFoundError } from '../util/exceptions/http/NotFoundError';


export interface CreateClinicInput {
        name: string;
        phone?: string | null
        email?: string | null;
        logoUrl?: string | null;
    }

export class CreateClinicUsecase {
    constructor(private readonly clinicRepository: IClinicRepository) {}
    
    async execute(input: CreateClinicInput): Promise<Clinic> {
        if(input.email){
            const existingClinic = await this.clinicRepository.findByEmail(input.email);
            if(existingClinic){
                logger.error(`A clinic with email ${input.email} already exists`);
                throw new ConflictError('A clinic with this email already exists');
            }
        }
        const clinic = Clinic.create({
            id: randomUUID(),
            name: input.name,
            phone: input.phone ?? null,
            email: input.email ?? null,
            logoUrl: input.logoUrl ?? null,
        });
        return await this.clinicRepository.save(clinic);
    }
}