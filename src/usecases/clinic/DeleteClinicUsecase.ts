import { IClinicRepository } from "../../repository/interfaces/IClinicRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class DeleteClinicUsecase {
    constructor(private readonly clinicRepository: IClinicRepository) { }

    async execute(id: string): Promise<void> {
        const clinic = await this.clinicRepository.findById(id);
        if (!clinic) {
            throw new NotFoundError('Clinic not found');
        }
        await this.clinicRepository.delete(id);
    }
}
