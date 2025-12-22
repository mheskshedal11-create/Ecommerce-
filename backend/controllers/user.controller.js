import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import generateAccessToken from '../utils/generateAccessToken.js'
import generateRefreshToken from '../utils/generateRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'

export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill the Required Fields'
            })
        }

        // Check if email is already registered
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashPassword
        })
        await newUser.save()

        // Return response
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: newUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || error.response || 'An unexpected error occurred'
        })
    }
}

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email and exclude password field in the response
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }


        // Generate tokens
        const accesstoken = await generateAccessToken(user._id);
        const refreshtoken = await generateRefreshToken(user._id);

        // Ensure secure cookie setting handles undefined NODE_ENV
        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

        // Set cookies
        res.cookie('accessToken', accesstoken, cookieOption);
        res.cookie('refreshToken', refreshtoken, cookieOption);

        // Respond with success and tokens

        const removePassword = user.toObject();
        delete removePassword.password;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: removePassword,
                accesstoken,
                refreshtoken
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export const logoutUserController = async (req, res) => {
    try {
        const userId = req.user._id;  // Access user ID from req.user (set by authMiddleware)

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

        // Clear cookies
        res.clearCookie('accessToken', cookieOption);
        res.clearCookie('refreshToken', cookieOption);

        // Optionally, remove the refresh token from the user document (if stored in the DB)
        await User.findByIdAndUpdate(userId, {
            $unset: { refresh_token: "" } // Use $unset to remove the refresh_token field
        });

        return res.status(200).json({
            success: true,
            message: 'Logout successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

//export user avatar
export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user._id; // auth middleware
        const image = req.file; // multer middleware

        // Upload the image to Cloudinary
        const upload = await uploadImageCloudinary(image);

        // Update the user's avatar field with the Cloudinary image URL
        const updateUser = await User.findByIdAndUpdate(userId, {
            $set: { avatar: upload.url } // Fixed the syntax here
        });

        return res.json({
            message: 'Profile image uploaded successfully',
            data: upload
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || error
        });
    }
};
