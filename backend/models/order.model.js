import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    product_details: {
        _id: String,
        name: String,
        image: Array,

    },
    pyamentId: {
        type: String,
        default: ''
    },
    pyament_status: {
        type: String,
        default: ''

    },
    delivery_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    invoice_receipt: {
        type: String,
        default: ''
    }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order