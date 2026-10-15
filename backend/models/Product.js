const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Original price is required'],
        min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price cannot be negative'],
    },
    countInStock: {
        type: Number,
        required: [true, 'Stock count is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    sizes: [
        {
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        },
    ],
    colors: [
        {
            type: String,
            trim: true,
        },
    ],
    collections: {
        type: String,
        trim: true,
    },
    material: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex'],
        default: 'Unisex',
    },
    images: [
        {
            url: {
                type: String,
                required: true,
                trim: true,
            },
            alt: {
                type: String,
                trim: true,
            },
        },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
    },    
    isPublished: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    tags: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    metaTitle: {
        type: String,
    },
    metaDescription: {
        type: String
    },
    metaKeywords: {
        type: String
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
    },
    weight: Number,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
