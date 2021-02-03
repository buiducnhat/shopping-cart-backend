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
        require: true,
        min: [1, 'quantity cannot be less than 1']
    }
}, {
    timestamps: true
})

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    name: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    items: [ItemSchema],
    status: {
        type: OrderStatus,
        require: true,
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