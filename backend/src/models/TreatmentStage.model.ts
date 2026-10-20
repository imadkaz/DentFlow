import { ConflictError } from "../util/exceptions/http/ConflictError";
import { ValidationError } from "../util/exceptions/http/ValidationError";

export interface TreatmentStageProps{
    id: string,
    planId: string,
    name: string,
    sequence: number,
    completed?: boolean,
    completedAt?: Date | null,
    notes?: string | null
}

export class TreatmentStage{ 
    private constructor( 
        private readonly id: string,
        private readonly planId: string,
        private name: string,
        private readonly sequence: number,
        private completed: boolean,
        private completedAt: Date | null,
        private notes: string | null
    ) {}

    static create(props: TreatmentStageProps): TreatmentStage{

        const trimmedName = props.name?.trim() ?? '';
        if(trimmedName.length === 0 ){
            throw new ValidationError("Stage name is required!")
        }

        if(trimmedName.length > 120 ){
            throw new ValidationError("Stage name must be at most 120 characters")
        }

        if(!Number.isInteger(props.sequence) || props.sequence < 1 ){
            throw new ValidationError("Stage sequence must be a positive integer")
        }
        const completed = props.completed ?? false;
        const completedAt = props.completedAt ?? null;

        if(completed && completedAt === null ){
            throw new ValidationError("A Completed plan must have a completion date")
        }
        if(!completed && completedAt !== null){
            throw new ValidationError("An incomplete stage cannot have a completion date")
        }

        return new TreatmentStage(
            props.id,
            props.planId,
            trimmedName,
            props.sequence,
            completed,
            completedAt,
            props.notes ?? null
        )
    }

    getId(): string { return this.id }

    getPlanId(): string { return this.planId }

    getName(): string { return this.name }

    getSequence(): number { return this.sequence }

    isCompleted(): boolean { return this.completed }

    getCompletedAt(): Date | null { return this.completedAt }

    getNotes(): string | null { return this.notes }

    complete(at: Date = new Date()): void {
        if(this.completed){
            throw new ConflictError("Stage is already completed")
        }
        this.completed = true
        this.completedAt = at
    }


}