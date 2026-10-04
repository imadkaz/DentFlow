import { PrismaClient } from "../generated/prisma/client";
import { UserMapper } from "../mapper/User.mapper";
import { User } from "../models/User.model";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository implements IUserRepository{

    constructor(private readonly prisma: PrismaClient) {}

    async findByEmail(email: string): Promise<User | null> {
        const raw = await this.prisma.user.findUnique({ where: { email }})
        return raw ? UserMapper.toDomain(raw) : null;
    }
    async findById(id: string): Promise<User | null> {
        const raw = await this.prisma.user.findUnique({ where: { id }})
        return raw ? UserMapper.toDomain(raw) : null;
    } 
    async save(user: User): Promise<User> {
        const raw = await this.prisma.user.create({ data: UserMapper.toPersistence(user) })
        return UserMapper.toDomain(raw);
    }
    async update(user: User): Promise<User> {
        const raw = await this.prisma.user.update({ where: { id: user.getId() }, data: UserMapper.toPersistence(user) })
        return UserMapper.toDomain(raw);
    }
    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id }});
    } 
    
}