import { TreatmentStage } from "../../models/TreatmentStage.model";
import { ITreatmentStageRepository } from "../../repository/interfaces/ITreatmentStageRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";

export class GetTreatmentStageUsecase {
    constructor(
        private readonly tSRepository: ITreatmentStageRepository
    ) { }

    async execute(stageId: string): Promise<TreatmentStage> {

        const treatemtnStage = await this.tSRepository.findById(stageId);
        if (!treatemtnStage) throw new NotFoundError("Treatment Stage Not Found")

        return treatemtnStage
    }
}