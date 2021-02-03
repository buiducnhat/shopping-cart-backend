'use strict'

const jwt = require('jsonwebtoken')
const express = require('express')
const userRoute = express.Router()

const userController = require('../../../controllers/user/user.controller')
const verifyToken = require('../../middlewares/verifyToken')

userRoute.post('/signup', async (req, res, next) => {
    try {
        let {name, email, phoneNumber, address, password} = req.body
        const isExistedUser = await userController.checkExistUser(email, phoneNumber)
        if (isExistedUser) {
            return res.status(200).json({message: `email or phone number had already existed`})
        }

        const userData = await userController.signup(name, email, phoneNumber, address, password)
        const SECRET_KEY = process.env.SECRET_KEY
        const accessToken = jwt.sign(
            {
                userId: userData._id,
            },
            SECRET_KEY,
            {
                expiresIn: 86400
            }
        )
        return res.status(200).json({
            message: 'create new user successfully',
            accessToken,
            userData
        })
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

userRoute.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body
        let userData = await userController.login(email, password)

        const SECRET_KEY = process.env.SECRET_KEY
        const accessToken = jwt.sign(
            {
                userId: userData._id,
            },
            SECRET_KEY,
            {
                expiresIn: 86400
            }
        )

        return res.status(200).json({
            accessToken,
            userData
        })
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

userRoute.get('/:userId', verifyToken, async (req, res, next) => {
    try {
        const {userId} = req.params
        if (userId !== req.userId) {
            return res.status(403).json({message: 'unauthorized'})
        }
        const userData = await userController.getInformation(userId)
        return res.status(200).json(userData)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

userRoute.put('/:userId', verifyToken, async (req, res, next) => {
    try {
        const {userId} = req.params
        if (userId !== req.userId) {
            return res.status(403).json({message: 'unauthorized'})
        }
        const {name, email, phoneNumber, address} = req.body
        const result = await userController.updateInfo(userId, name, email, phoneNumber, address)
        return res.status(200).json(result)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

userRoute.delete('/:userId', verifyToken, async (req, res, next) => {
    try {
        const {userId} = req.params
        if (userId !== req.userId) {
            return res.status(403).json({message: 'unauthorized'})
        }
        const result = await userController.deleteUser(userId)
        return res.status(200).json(result)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

module.exports = userRoute