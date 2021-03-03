'use strict'

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    orignalPrice: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
    },
    currentPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    productImage: {
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        default: 99
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema)
