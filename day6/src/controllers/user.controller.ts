import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { IUserCreation } from "../models/user.model";

export const UserController = {
    createUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body)
            const { name, email, password } = req.body
            const user = await UserService.createUser({name, email, password});
            res.status(201).json({ user, message: "User created successfully" });
        } catch (err) {
            next(err);
        }
    },

    getUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const user = await UserService.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    },

    getAllUsers: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    },

    updateUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const userData = req.body as IUserCreation;
            const updatedUser = await UserService.updateUser(userId, userData);
            res.status(200).json({ updatedUser, message: "User updated successfully" });
        } catch (err) {
            next(err);
        }
    },

    deleteUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            await UserService.deleteUser(userId);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
};
