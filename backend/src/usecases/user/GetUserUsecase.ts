import { IUserRepository } from "../../repository/interfaces/IUserRepository";
import { User } from "../../models/User.model";
import { NotFoundError } from "../../util/exceptions/http/NotFoundError";
export class GetUserUsecase {
    constructor(private readonly userRepository: IUserRepository){}

    async executeById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if(!user){
            throw new NotFoundError('User not found');
        }
        return user;

    }

    async executeByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new NotFoundError('User not found');
        }
        return user;
    }
}