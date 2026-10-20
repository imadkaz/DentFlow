import { ITreatmentStageRepository } from "../../repository/interfaces/ITreatmentStageRepository";
import { ConflictError } from "../../util/exceptions/http/ConflictError";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class DeleteTreatmentStageUsecase {
    constructor(
        private readonly tSRepository: ITreatmentStageRepository
    ){}

    async execute(stageId: string): Promise<void> {

        const stage = await this.tSRepository.findById(stageId)

        if(!stage) throw new NotFoundError("There isn't treatment stage to delete")

        if(stage.isCompleted()){
            throw new ConflictError("Completed stages cannot be deleted")
        }


        await this.tSRepository.delete(stageId)
    }
}