import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
import { IUserRepository } from "../../repository/interfaces/IUserRepository";

export class DeleteUserUsecase {
    constructor(private readonly userRepository: IUserRepository) { }
    async execute(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        await this.userRepository.delete(id);
    }
}