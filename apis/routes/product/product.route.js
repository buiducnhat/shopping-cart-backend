'use strict'

const express = require('express')
const productRoute = express.Router()

const uploadImage = require('../../middlewares/uploadImage')
const verifyToken = require('../../middlewares/verifyToken')
const checkPermission = require('../../middlewares/checkPermission')
const productController = require('../../../controllers/product/product.controller')

// Api to create new product (require Admin perrmission)
productRoute.post('/',
    verifyToken,
    checkPermission,
    uploadImage.single('productImage'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(500).json({message: 'image file not found'})
            }
            let productImage = req.file.path
            let {name, price, salePrice, description} = req.body
            const result = await productController.create(name, price, salePrice, productImage, description)

            return res.status(200).json({message: 'create new product successfully', result})
        } catch (error) {
            if (error.status && error.message) {
                return res.status(error.status).json({message: error.message})
            }
            return res.status(500).json(error)
        }
    })

// Api to get all products (with sort, page)
productRoute.get('/', async (req, res, next) => {
    try {
        let pageNum = req.query?.page,
            sortType = req.query?.sort

        const itemPerPage = 8
        const products = await productController.getAll(itemPerPage, pageNum, sortType)
        return res.status(200).json(products)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

// Api to get product by ID
productRoute.get('/:productId', async (req, res, next) => {
    try {
        let {productId} = req.params
        const result = await productController.getById(productId)

        if (!result) {
            return res.status(404).json({message: `product with id ${productId} not found`})
        }
        return res.status(200).json(result)
    } catch (error) {
        if (error.status && error.message) {
            return res.status(error.status).json({message: error.message})
        }
        return res.status(500).json(error)
    }
})

// Api to update data of a product (require Admin perrmission)
productRoute.put('/:productId',
    verifyToken,
    checkPermission,
    uploadImage.single('productImage'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(500).json({message: 'image file not found'})
            }
            const {productId} = req.params
            const productImage = req.file.path
            const {name, price, salePrice, description} = req.body
            const result = await productController.updateById(productId, name, price, salePrice, productImage, description)

            return res.status(200).json({message: 'update product successfully', result})
        } catch (error) {
            if (error.status && error.message) {
                return res.status(error.status).json({message: error.message})
            }
            return res.status(500).json(error)
        }
    })

// Api to remove a product (require Admin perrmission)
productRoute.delete('/:productId',
    verifyToken,
    checkPermission,
    async (req, res, next) => {
        try {
            const {productId} = req.params
            const result = await productController.deleteById(productId)
            if (!result) {
                return res.status(404).json({message: `product with id ${[productId]} not found`})
            }
            return res.status(200).json({message: 'remove product successfully', result})
        } catch (error) {
            if (error.status && error.message) {
                return res.status(error.status).json({message: error.message})
            }
            return res.status(500).json(error)
        }
    })

module.exports = productRoute