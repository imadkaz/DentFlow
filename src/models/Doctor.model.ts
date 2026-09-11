import logger from "../util/logger";

export interface DocotorProps{
    id: string,
    clinicId: string,
    userId: string,
    name: string,
    licenseNo: string,
    specialty?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: Date
}

export class Doctor {
    private constructor(
        private readonly id: string,
        private readonly clinicId: string,
        private readonly userId: string,
        private name : string,
        private licenseNo: string,
        private readonly createdAt: Date,
        private specialty?: string | null,
        private phone?: string | null,
        private email?: string | null,
    ){}

    static create(props: DocotorProps) : Doctor {
        const trimedName = props.name?.trim() ?? '';
        if(trimedName.length === 0 ){
            logger.error("Doctor name is required");
            throw new Error("Doctro name is required");
        }
        if(trimedName.length > 120 ){
            logger.error("Doctor name most be at most 120 characters")
            throw new Error("Doctor name most be at most 120 characters")
        }

        const now = new Date();
        return new Doctor(
            props.id,
            props.clinicId,
            props.userId,
            props.name,
            props.licenseNo,
            props.createdAt ?? now,
            props.specialty ?? null,
            props.phone ?? null,
            props.email ?? null,
        );
    }
    getId(): string { return this.id};
    getUserId(): string { return this.userId}
    getClinicId(): string { return this.clinicId}
    getName(): string { return this.name}
    getLicenseNo(): string { return this.licenseNo}
    getEmail(): string | null | undefined { return this.email}
    getPhone(): string | null | undefined { return this.phone}
    getSpecialty(): string | null | undefined {return this.specialty}
    getCreatedAt(): Date { return this.createdAt}

    rename( newName: string ) : void {
        const trimmedName = newName.trim() ?? '';
        if(trimmedName.length === 0){
            logger.error("Doctor name is required");
            throw new Error("Doctro name is required");
        }
        if(trimmedName.length > 120){
            logger.error("Doctor name most be at most 120 characters")
            throw new Error("Doctor name most be at most 120 characters")
        }
        this.name = trimmedName
    }
   
}