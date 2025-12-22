import jwt from 'jsonwebtoken'
const generateAccessToken = async (userId) => {
    try {
        const accessToken = await jwt.sign(
            { id: userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5h' }
        )
        return accessToken
    } catch (error) {
        console.log(error)
    }
}

export default generateAccessToken