import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import generateAccessToken from '../utils/generateAccessToken.js'
import generateRefreshToken from '../utils/generateRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
import generateOtp from '../utils/generateOpt.js'

export const registerUserController = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body

        // Validate required fields
        if (!name || !email || !password || !mobile) {
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
            password: hashPassword,
            mobile
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
        const { email, mobile, password } = req.body;

        // 1️⃣ Validation
        if ((!email && !mobile) || !password) {
            return res.status(400).json({
                success: false,
                message: "Email or mobile and password are required",
            });
        }

        // 2️⃣ Build query dynamically
        let query = {};
        if (email) {
            query.email = email.toLowerCase();
        } else if (mobile) {
            query.mobile = mobile;
        }

        // 3️⃣ Find user
        const user = await User.findOne(query);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }


        // 4️⃣ Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
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


//update user detail 
export const updateUserDetailController = async (req, res) => {
    try {
        const userId = req.user._id
        const { name, email, mobile, password } = req.body

        let hashPassword = ''

        if (password) {
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password, salt)
        }
        const updateUser = await User.findByIdAndUpdate(userId, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
        }, { new: true })
        return res.status(200).json({
            success: false,
            message: 'update successfully',
            updateUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error || error.message
        })
    }
}


// for udpate password 
export const updatePasswordController = async (req, res) => {
    try {
        const userId = req.user._id
        const { password, newPassword } = req.body

        if (!password || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both current and new password are required"
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // 🔐 Check old password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            })
        }

        // 🚫 Prevent same password reuse (optional but good)
        const isSame = await bcrypt.compare(newPassword, user.password)
        if (isSame) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from old password"
            })
        }

        // 🔒 Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
            password: user.password
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { mobile, email } = req.body;

        // Validate input
        if (!mobile && !email) {
            return res.status(400).json({
                success: false,
                message: "Please enter either your mobile number or email"
            });
        }

        // Find user by email or mobile
        let user = null;
        if (email) {
            user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "No user found with this email"
                });
            }
        }

        if (mobile) {
            user = await User.findOne({ mobile });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "No user found with this mobile number"
                });
            }
        }

        // Generate OTP and set expiry time
        const otp = generateOtp();  // Ensure generateOtp() is defined elsewhere
        const expire_time = new Date().getTime() + 60 * 60 * 1000; // 1 hour expiry

        // Update user with OTP and expiry
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expire_time).toISOString()
        }, { new: true });

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Successfully initiated password reset. Check your email or mobile for OTP.",
            update: updatedUser
        });

    } catch (error) {
        console.error('Error during password reset process:', error.message);
        console.error(error.stack);  // This gives you the full stack trace

        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
            error: error.message  // Optionally include the error message in the response for easier debugging
        });
    }
};
