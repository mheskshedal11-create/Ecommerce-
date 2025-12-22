import express from 'express'
import 'dotenv/config'
import dbConnect from './db/connection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()

const PORT = process.env.PORT || 4000


app.use(cors({
    origin: 'http://localhost:5173/',
    methods: ['GET', "POST", 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cashe-Control',
        'Expires',
        'Pragms'
    ],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//create db connection
dbConnect()





app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`)

})

