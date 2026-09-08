import { Request, Response } from "express";
import { CreateUserUsecase } from "../usecases/user/CreateUserUsecase";
import { DeleteUserUsecase } from "../usecases/user/DeleteUserUsecase";
import { GetUserUsecase } from "../usecases/user/GetUserUsecase";
import { UpdateUserUsecase } from "../usecases/user/UpdateUserUsecase";
import { User } from "../models/User.model";

export class UserController {
    constructor (
        private readonly getUserUsecase: GetUserUsecase,
        private readonly deleteUserUsecase: DeleteUserUsecase,
        private readonly updateUserUsecase: UpdateUserUsecase,
        private readonly createUserUsecase: CreateUserUsecase
    ){}

    createUser = async (req: Request, res: Response) => {
        const input = req.body;
        const user = await this.createUserUsecase.execute({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            password: input.password,
        })

        res.status(201).json(this.toResponse(user));
    }

    getUserById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const user = await this.getUserUsecase.executeById(id as string);
        res.status(200).json(this.toResponse(user));
    }

    getUserByEmail = async (req: Request, res: Response) => {
        const email = req.params.email;
        const user = await this.getUserUsecase.executeByEmail(email as string);
        res.status(200).json(this.toResponse(user));
    }

    deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        await this.deleteUserUsecase.execute(id as string);
        res.status(204).send();
    }

    updateUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        const input = req.body;
        const user = await this.updateUserUsecase.execute({ 
            id: id as string,
            name: input.name,
            lastName: input.lastName,
            email: input.email,
            password: input.password,
         });
        res.status(200).json(this.toResponse(user));
    }


    private toResponse(user: User) {
        return {
            id: user.getId(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            createdAt: user.getCreatedAt(),
            updatedAt: user.getUpdatedAt(),
        }
    }
}