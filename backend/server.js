import express from 'express'
import 'dotenv/config'
import dbConnect from './config/connection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.controller.js'
import uploadImage from './route/upload.route.js'

const app = express()

const PORT = process.env.PORT || 4000

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', "POST", 'DELETE', 'PUT'],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
    crossOriginResourcePolicy: true
}))
app.use(morgan('dev'))


app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/file', uploadImage)

dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`)
    })
})
