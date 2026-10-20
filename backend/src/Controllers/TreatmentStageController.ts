import { CompleteTreatmentStageUsecase } from "../usecases/TreatmentStage/CompleteTreatmentStageUsecase";
import { CreateTreatmentStageUsecase } from "../usecases/TreatmentStage/CreateTreatmentStageUsecase";
import { DeleteTreatmentStageUsecase } from "../usecases/TreatmentStage/DeleteTreatmentStageUsecase";
import { GetTreatmentStageUsecase } from "../usecases/TreatmentStage/GetTreatmentStageUsecase";
import { UpdateTreatmentStageUsecase } from "../usecases/TreatmentStage/UpdateTreatmentStageUsecase";
import { Request, Response } from "express";
import { NotFoundError } from "../util/exceptions/http/NotFoundError";
import { TreatmentStage } from "../models/TreatmentStage.model";
import { GetPlanStagesUsecase } from "../usecases/TreatmentStage/GetPlansStagesUsecase";

export class TreatmentStageController {

    constructor(
        private readonly createTSUsecase: CreateTreatmentStageUsecase,
        private readonly updateTSUsecase: UpdateTreatmentStageUsecase,
        private readonly completeTSUsecase: CompleteTreatmentStageUsecase,
        private readonly getTSUsecase: GetTreatmentStageUsecase,
        private readonly getPlanStagesUsecase: GetPlanStagesUsecase,
        private readonly deleteTSUsecase: DeleteTreatmentStageUsecase
    ) { }

    create = async (req: Request, res: Response) => {
        const input = req.body

        const treatmentStage = await this.createTSUsecase.execute({
            planId: input.planId,
            name: input.name,
            sequence: input.sequence,
            notes: input.notes
        })

        res.status(201).json(this.toResponse(treatmentStage))
    }

    update = async (req: Request, res: Response) => {
        const input = req.body;
        const id = req.params.id as string
        if (!id) {
            throw new NotFoundError("Treatment stage not Found")
        }

        const updateStage = await this.updateTSUsecase.execute({
            id,
            name: input.name,
            notes: input.notes
        })

        res.status(200).json(this.toResponse(updateStage))
    }

    getStage = async (req: Request, res: Response) => {
        const id = req.params.id as string
        if (!id) throw new NotFoundError("Treatment stage not Found")

        const stage = await this.getTSUsecase.execute(id)

        res.status(200).json(this.toResponse(stage))
    }

    getPlanStages = async (req: Request, res: Response) => {
        const stages = await this.getPlanStagesUsecase.execute(req.params.planId as string);
        res.status(200).json(stages.map(s => this.toResponse(s)));
    };

    deleteStage = async (req: Request, res: Response) => {
        const id = req.params.id as string
        if (!id) throw new NotFoundError("Treatment stage not found")

        await this.deleteTSUsecase.execute(id)

        res.status(204).send()
    }

    completed = async (req: Request, res: Response) => {
        const id = req.params.id as string
        if (!id) {
            throw new NotFoundError("Treatment stage not found");
        }
        const isCompleted = await this.completeTSUsecase.execute(id)

        res.status(200).json(this.toResponse(isCompleted))
    }

    private toResponse(treatment: TreatmentStage) {
        return {
            id: treatment.getId(),
            planId: treatment.getPlanId(),
            name: treatment.getName(),
            sequence: treatment.getSequence(),
            completed: treatment.isCompleted(),
            completedAt: treatment.getCompletedAt(),
            notes: treatment.getNotes()
        }
    }

}