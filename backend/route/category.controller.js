import express from 'express'
import { addCategoryControllr } from '../controllers/category.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
const categoryRouter = express.Router()

categoryRouter.post('/add-category', authMiddleware, addCategoryControllr)

export default categoryRouter