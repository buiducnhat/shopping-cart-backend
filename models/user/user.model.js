'use strict'

const mongoose = require('mongoose')

const UserModel = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    avatar:{
        type:String
    },
    phoneNumber: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: 'user'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserModel)