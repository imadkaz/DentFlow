// src/models/Clinic.ts

import logger from "../util/logger";

export class Clinic {
    private constructor(
        private readonly id: string,
        private name: string,
        private phone: string | null,
        private email: string | null,
        private logoUrl: string | null,
        private readonly createdAt: Date,
        private updatedAt: Date,
    ) {}

    static create(props: {
        id: string;
        name: string;
        phone?: string | null;
        email?: string | null;
        logoUrl?: string | null;
        createdAt?: Date;
        updatedAt?: Date;
    }): Clinic {
        const trimmedName = props.name?.trim() ?? '';
        if (trimmedName.length === 0) {
            logger.error('Clinic name is required');
            throw new Error('Clinic name is required');
        }
        if (trimmedName.length > 120) {
            logger.error('Clinic name must be at most 120 characters');
            throw new Error('Clinic name must be at most 120 characters');
        }

        const now = new Date();
        return new Clinic(
            props.id,
            trimmedName,
            props.phone ?? null,
            props.email ?? null,
            props.logoUrl ?? null,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );
    }

    getId(): string { return this.id; }
    getName(): string { return this.name; }
    getPhone(): string | null { return this.phone; }
    getEmail(): string | null { return this.email; }
    getLogoUrl(): string | null { return this.logoUrl; }
    getCreatedAt(): Date { return this.createdAt; }
    getUpdatedAt(): Date { return this.updatedAt; }

    rename(newName: string): void {
        const trimmed = newName?.trim() ?? '';
        if (trimmed.length === 0) {
            logger.error('Clinic name is required');
            throw new Error('Clinic name is required');
        }
        if (trimmed.length > 120) {
            logger.error('Clinic name must be at most 120 characters');
            throw new Error('Clinic name must be at most 120 characters');
        }
        this.name = trimmed;
        this.updatedAt = new Date();
    }
}
