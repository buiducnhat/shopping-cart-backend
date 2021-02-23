'use strict'

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    orignalPrice: {
        type: Number,
        require: true
    },
    salePrice: {
        type: Number,
    },
    currentPrice: {
        type: Number,
        require: true
    },
    description: {
        type: String
    },
    productImage: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema)
