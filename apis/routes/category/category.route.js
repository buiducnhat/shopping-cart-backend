'use strict'

const express = require('express')
const categoryRoute = express.Router()

const verifyToken = require('../../middlewares/verifyToken')
const {checkBody} = require('../../middlewares/checkRequiredField')
const checkPermission = require('../../middlewares/checkPermission')
const categoryController = require('../../../controllers/category/category.controller')

// Api to get all categories
categoryRoute.get('/', async (req, res, next) => {
    try {
        const result = await categoryController.getAll()
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

// Api to create new category
categoryRoute.post('/', verifyToken, checkPermission, checkBody(['name']), async (req, res, next) => {
    try {
        const {name} = req.body
        const result = await categoryController.create(name)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

module.exports = categoryRoute