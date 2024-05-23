import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post('/users', UserController.createUser);
userRoutes.get('/users/:id', UserController.getUser);
userRoutes.get('/users', UserController.getAllUsers);
userRoutes.put('/users/:id', UserController.updateUser);
userRoutes.delete('/users/:id', UserController.deleteUser);

export default userRoutes;
