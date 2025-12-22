import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
const generateRefreshToken = async (userId) => {
    try {
        const refreshToken = await jwt.sign(
            { id: userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
        const updateRefreshTokenUser = await User.updateOne(
            {
                _id: userId
            },
            {
                refresh_token: refreshToken
            })
        return refreshToken
    } catch (error) {
        console.log(error)
    }
}
export default generateRefreshToken