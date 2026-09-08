// src/routes/User.Routes.ts
import { Router } from "express";
import { UserController } from "../Controllers/UserControllers";
import { asyncHandler } from "../middleware/asyncHandler";

export function UserRoutes(userController: UserController): Router {
    const router = Router();

    router.post('/', asyncHandler(userController.createUser));
    router.get('/:id', asyncHandler(userController.getUserById));
    router.get('/email/:email', asyncHandler(userController.getUserByEmail));
    router.put('/:id', asyncHandler(userController.updateUser));
    router.delete('/:id', asyncHandler(userController.deleteUser));

    return router;
}