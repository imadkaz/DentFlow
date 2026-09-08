import logger from "../util/logger";

export class User {
    private constructor(
        private readonly id: string,
        private firstName: string,
        private lastName: string,
        private email: string,
        private passwordHash: string,
        private readonly createdAt: Date,
        private updatedAt: Date,
    ) {}

    static create(props: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        passwordHash: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): User {
        const trimmedFirstName = props.firstName?.trim() ?? '';
        const trimmedLastName = props.lastName?.trim() ?? '';
        if(trimmedFirstName.length === 0 || trimmedLastName.length === 0){
            logger.error('User first name and last name are required');
            throw new Error('User first name and last name are required');
        }
        if(trimmedFirstName.length > 120 || trimmedLastName.length > 120){
            logger.error('User first name and last name must be at most 120 characters');
            throw new Error('User first name and last name must be at most 120 characters');
        }
        const now = new Date();
        return new User(
            props.id,
            trimmedFirstName,
            trimmedLastName,
            props.email,
            props.passwordHash,
            now,
            now
        );

    }
    getId(): string { return this.id; }
    getFirstName(): string { return this.firstName; }
    getLastName(): string { return this.lastName; }
    getEmail(): string { return this.email; }
    getPasswordHash(): string { return this.passwordHash; }
    getCreatedAt(): Date { return this.createdAt; }
    getUpdatedAt(): Date { return this.updatedAt; }

    rename(newFirstName: string, newLastName: string): void {
        const trimmedFirstName = newFirstName?.trim() ?? '';
        const trimmedLastName = newLastName?.trim() ?? '';
        if(trimmedFirstName.length === 0 || trimmedLastName.length === 0){
            logger.error('User first name and last name are required');
            throw new Error('User first name and last name are required');
        }
        if(trimmedFirstName.length > 120 || trimmedLastName.length > 120){
            logger.error('User first name and last name must be at most 120 characters');
            throw new Error('User first name and last name must be at most 120 characters');
        }

        this.firstName = trimmedFirstName;
        this.lastName = trimmedLastName;
        this.updatedAt = new Date();
    }
}