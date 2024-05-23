import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'
import User from "../models/user.model";

dotenv.config()


const databaseName = process.env.DB_NAME
const databaseUser = process.env.DB_USER
const databasePassword = process.env.DB_PASSWORD
const databaseHost = process.env.DB_HOST

const dbSequelize = new Sequelize({
    dialect: "mysql",
    host: databaseHost,
    username: databaseUser,
    password: databasePassword,
    database: databaseName,
    models: [User]
    // models: [__dirname + '/models/**/*.model.ts'],
    // modelMatch: (fileName, member) => {
    //     return fileName.substring(0, fileName.indexOf('.model')) === member.toLowerCase()
    // }
})

export default dbSequelize