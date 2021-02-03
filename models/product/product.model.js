'use strict'

const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    salePrice: {
        type: Number,
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
