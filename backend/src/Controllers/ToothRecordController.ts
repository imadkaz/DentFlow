import { ToothRecord } from "../models/ToothRecord.model";
import { GetPatientTeethUsecase } from "../usecases/ToothRecord/GetPatientTeethUsecase";
import { UpsetToothRecordUsecase } from "../usecases/ToothRecord/UpsetToothRecordUsecase";
import { Request, Response } from "express"


export class ToothRecordController {
    constructor(
        private readonly UpsetToothRecordUsecase: UpsetToothRecordUsecase,
        private readonly getPatientTeethUsecase: GetPatientTeethUsecase,
    ) {}

    upsertToothRecord = async (req: Request, res: Response) => {
        const input = req.body;
        const record = await this.UpsetToothRecordUsecase.execute({
            patientId: req.params.patientId as string,
            toothNumber: Number(req.params.num),
            surfaces: input.surfaces,
            status: input.status,
            notes: input.notes,
        });
        res.status(200).json(this.toResponse(record));
    };

    getPatientTeeth = async (req: Request, res: Response) => {
        const patientId = req.params.patientId  as string;
        const teeth = await this.getPatientTeethUsecase.execute(patientId);
        res.status(200).json(teeth.map(t => this.toResponse(t)));
    };

    private toResponse(record: ToothRecord) {
        return {
            id: record.getId(), 
            patientId: record.getPatientId(), 
            toothNumber: record.getToothNumber(),
            surfaces: record.getSurfaces(), 
            status: record.getStatus(),
            notes: record.getNotes(), 
            recordedAt: record.getRecordedAt(),
        };
    }
}