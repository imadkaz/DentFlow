import { User } from "../../models/User.model";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { randomUUID } from 'node:crypto';
import { ConflictError } from "../../util/exceptions/http/ConflictError";
import bcrypt from 'bcrypt';

export interface CreateUserInput{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class CreateUserUsecase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(input: CreateUserInput): Promise<User> {
        if(input.email){
            const existingUser = await this.userRepository.findByEmail(input.email);
            if(existingUser){
                throw new ConflictError('A user with this email already exists');
            }
        }
        const hashPassword = await bcrypt.hash(input.password, 10);
        const user = User.create({
            id: randomUUID(),
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            passwordHash: hashPassword,
        });
        return await this.userRepository.save(user);
    }
}