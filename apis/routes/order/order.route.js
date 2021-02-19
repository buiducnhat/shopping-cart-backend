'use strict'

const express = require('express')
const orderRoute = express.Router()

const verifyToken = require('../../middlewares/verifyToken')
const {checkBody} = require('../../middlewares/checkRequiredField')
const orderController = require('../../../controllers/order/order.controller')

// Api to get all orders of a user
orderRoute.get('/', verifyToken, async (req, res, next) => {
    try {
        const userId = req.userId
        const orders = await orderController.getOrderOfUser(userId)

        return res.status(200).json(orders)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

// Api to create new order
orderRoute.post('/', verifyToken,
    checkBody(['name', 'phoneNumber', 'address']),
    async (req, res, next) => {
        try {
            const userId = req.userId
            const {name, phoneNumber, address} = req.body
            const result = await orderController.createOrder(userId, name, phoneNumber, address)

            return res.status(200).json(result)
        } catch (error) {
            if (error.status && error.message) {
                return res.status(error.status).json({message: error.message})
            }
            return res.status(500).json(error)
        }
    })

// Api to cancel an active order
orderRoute.post('/cancel/:orderId', verifyToken, async (req, res, next) => {
    try {
        const userId = req.userId
        const {orderId} = req.params

        const result = await orderController.cancelOrder(userId, orderId)

        return res.status(200).json(result)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

// Api to complete an active order
orderRoute.post('/complete/:orderId', verifyToken, async (req, res, next) => {
    try {
        const userId = req.userId
        const {orderId} = req.params

        const result = await orderController.completeOrder(userId, orderId)

        return res.status(200).json(result)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

module.exports = orderRoute