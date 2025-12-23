import express from 'express'
import { forgotPasswordController, loginUserController, logoutUserController, registerUserController, resetPasswordController, updatePasswordController, updateUserDetailController, uploadAvatar, verifyForgotPassword } from '../controllers/user.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()
userRouter.post('/register', registerUserController)
userRouter.post('/login', loginUserController)
userRouter.get('/logout', authMiddleware, logoutUserController)
userRouter.put('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', authMiddleware, updateUserDetailController)
userRouter.put('/update-password', authMiddleware, updatePasswordController)
userRouter.get('/forgot-password', forgotPasswordController)
userRouter.put('/verify-otp', verifyForgotPassword)
userRouter.put('/reset-password', resetPasswordController)

export default userRouter