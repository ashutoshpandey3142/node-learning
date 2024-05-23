import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dbSequelize from './config/db'
import userRoutes from './routes/user.routes'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()
app.disable("x-powered-by");

const corsOptions = {
    origin: ['*'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
  
app.use(cors(corsOptions));
app.use(bodyParser.json())

dbSequelize.sync()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Error: ', err))

app.use(userRoutes)

const port = process.env.PORT

app.listen(port, () => console.log(`Server is running on port ${port}`))
