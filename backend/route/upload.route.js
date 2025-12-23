import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import uploadImageController from '../controllers/uploadImage.controller.js'

const uploadImage = express.Router()

uploadImage.post('/upload', authMiddleware, uploadImageController)

export default uploadImage