import { IDoctorRepository } from "../../repository/interfaces/IDoctorRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class DeleteDoctorUsecase{

    constructor(
        private readonly doctorRepository: IDoctorRepository
    ){}

    async execute(id: string) : Promise<void>{
        
        const doctor = await this.doctorRepository.findById(id);

        if(!doctor){
            throw new NotFoundError("Doctor Not Found!")
        }

        await this.doctorRepository.delete(id)
    }

}