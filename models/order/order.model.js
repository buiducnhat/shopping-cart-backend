'use strict'

const mongoose = require('mongoose')
const OrderStatus = require('./orderStatus')

const ItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'quantity cannot be less than 1']
    }
}, {
    timestamps: true
})

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    items: [ItemSchema],
    status: {
        type: OrderStatus,
        required: true,
        default: OrderStatus.active
    },
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', OrderSchema)