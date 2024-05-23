import User, { IUserCreation } from "../models/user.model";
import GlobalError from "../utils/errors/GlobalError";

export const UserService = {
    createUser: async (user: IUserCreation) => {
        try {
            const existingUser = await User.findOne({ where: { email: user.email } });
            if (existingUser) {
                throw new GlobalError("User already exists", 409);
            }
            const newUser = await User.create({
                name: user.name,
                email: user.email,
                password: user.password,
            });
            return newUser;
        } catch (err) {
            if (err instanceof GlobalError) throw err;
            throw new GlobalError(`Error: ${err}`, 500);
        }
    },

    getUserById: async (id: string) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new GlobalError("User not found", 404);
            }
            return user;
        } catch (err) {
            if (err instanceof GlobalError) throw err;
            throw new GlobalError(`Error: ${err}`, 500);
        }
    },

    getAllUsers: async () => {
        try {
            const users = await User.findAll();
            return users;
        } catch (err) {
            throw new GlobalError(`Error: ${err}`, 500);
        }
    },

    updateUser: async (id: string, updateData: Partial<IUserCreation>) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new GlobalError("User not found", 404);
            }
            await user.update(updateData);
            return user;
        } catch (err) {
            if (err instanceof GlobalError) throw err;
            throw new GlobalError(`Error: ${err}`, 500);
        }
    },

    deleteUser: async (id: string) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new GlobalError("User not found", 404);
            }
            await user.destroy();
            return { message: "User deleted successfully" };
        } catch (err) {
            if (err instanceof GlobalError) throw err;
            throw new GlobalError(`Error: ${err}`, 500);
        }
    },
};
