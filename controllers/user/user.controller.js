'use strict'

const bcrypt = require('bcrypt')
const validator = require('validator').default

const db = require('../../models')
const UserModel = db.users

exports.checkExistUser = (email, phoneNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await UserModel.find({$or: [{email}, {phoneNumber}]})
            if (result.length > 0) {
                return resolve(true)
            }
            return resolve(false)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.signup = (name, email, phoneNumber, address, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!validator.isEmail(email)) {
                return reject({status: 500, message: 'invalid email'})
            }
            if (password.length < 8) {
                return reject({status: 500, message: 'invalid password'})
            }
            password = bcrypt.hashSync(password, 8)
            const avatar = `https://ui-avatars.com/api/?size=128&background=34495e&color=fff&name=${name.replace(/\s/g, '+')}`
            const newUser = new UserModel({name, email, avatar, phoneNumber, address, password})
            const result = await newUser.save(newUser)

            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.login = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userFounded = await UserModel.findOne({email})
            if (!userFounded) {
                return reject({status: 401, message: 'user not found'})
            }
            if (!bcrypt.compareSync(password, userFounded.password)) {
                return reject({status: 401, message: 'wrong password'})
            }
            return resolve(userFounded)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getInformation = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = await UserModel.findById(userId)
            if (!userData) {
                return reject({status: 404, message: 'user not found'})
            }
            return resolve(userData)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.updateInfo = (userId, name, email, phoneNumber, address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const avatar = `https://ui-avatars.com/api/?size=128&background=34495e&color=fff&name=${name.replace(/\s/g, '+')}`
            const result = await UserModel.findByIdAndUpdate(userId, {name, email, avatar, phoneNumber, address})
            if (!result) {
                return reject({status: 404, message: 'user not found'})
            }
            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await UserModel.findByIdAndDelete(userId)
            if (!result) {
                return reject({status: 404, message: 'user not found'})
            }

            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}