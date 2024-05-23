import { Optional } from "sequelize";
import { AllowNull, BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from "sequelize-typescript";
import bcrypt from 'bcrypt';

interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
}

export interface IUserCreation extends Optional<IUser, 'id'> {}

@Table({
    timestamps: true,
    tableName: 'user'
})
class User extends Model<IUserCreation, IUser> {
    @Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    declare id: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    declare name: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    declare email: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    declare password: string;

    // Encrypt password before creating or updating user
    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(user: User) {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }

    // Instance method to check password
    async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}

export default User;
