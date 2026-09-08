import { User as prismaUser, Prisma} from '../generated/prisma/client';
import { User } from '../models/User.model';

export class UserMapper {
    static toDomain(raw: prismaUser): User {
        return User.create({
            id: raw.id,
            firstName: raw.firstName,
            lastName: raw.lastName,
            email: raw.email,
            passwordHash: raw.passwordHash,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toPersistence(user: User) : Prisma.UserUncheckedCreateInput {
        return {
            id: user.getId(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            passwordHash: user.getPasswordHash(),
            createdAt: user.getCreatedAt(),
            updatedAt: user.getUpdatedAt(),
        };
    }
}