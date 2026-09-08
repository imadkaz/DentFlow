import { User } from "../../models/User.model";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import bcrypt from 'bcrypt';

export interface UpdateUserInput {
    id: string;
    name?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export class UpdateUserUsecase { 
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(input: UpdateUserInput): Promise<User> {
            const existingUser = await this.userRepository.findById(input.id);
            if(!existingUser) {
                throw new NotFoundError('User not found');
            }
        const newPasswordHash = input.password !== undefined
            ? await bcrypt.hash(input.password, 10)   // ✅ hashing فعلي هون
            : existingUser.getPasswordHash();
            
        const updatedUser = User.create({
            id: existingUser.getId(),
            firstName: input.name !== undefined ? input.name : existingUser.getFirstName(),
            lastName: input.lastName !== undefined ? input.lastName : existingUser.getLastName(),
            email: input.email !== undefined ? input.email : existingUser.getEmail(),
            passwordHash: newPasswordHash,
            createdAt: existingUser.getCreatedAt(),
            updatedAt: new Date(),
        });

        return await this.userRepository.update(updatedUser);
    }
}