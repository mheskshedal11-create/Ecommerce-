import express from 'express'
import { loginUserController, logoutUserController, registerUserController } from '../controllers/user.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const userRouter = express.Router()
userRouter.post('/register', registerUserController)
userRouter.post('/login', loginUserController)
userRouter.get('/logout', authMiddleware, logoutUserController)

export default userRouter