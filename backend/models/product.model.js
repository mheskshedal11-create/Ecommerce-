import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: Array,
        default: []
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            def: 'Category'
        }
    ],
    subCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],
    unit: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    discount: {
        type: Number,
        default: null
    },
    more_detail: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: true
    }

}, { timeseries: true })

const Product = mongoose.model('Product', productSchema)

export default Product