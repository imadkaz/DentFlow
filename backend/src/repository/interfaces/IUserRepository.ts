import { User } from "../../models/User.model";
import { IRepository } from "./IRepository";

export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}