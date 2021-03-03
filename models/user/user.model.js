'use strict'

const mongoose = require('mongoose')

const UserModel = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar:{
        type:String
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserModel)