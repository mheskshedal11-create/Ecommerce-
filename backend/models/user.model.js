import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    mobile: {
        type: Number,
        default: null,
        unique: true
    },
    refresh_token: {
        type: String,
        default: ''
    },
    last_login_date: {
        type: Date,
        default: ''
    },
    address_detail: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Address'

        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'CartProduct'

        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Order'

        }
    ],
    forgot_password_otp: {
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }


}, { timestamps: true })
const User = mongoose.model('User', userSchema)

export default User