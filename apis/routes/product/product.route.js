'use strict'

const express = require('express')
const productRoute = express.Router()

const uploadImageByMulter = require('../../middlewares/uploadImageByMulter')
const uploadImageToImgur = require('../../middlewares/uploadImageToImgur')
const verifyToken = require('../../middlewares/verifyToken')
const checkPermission = require('../../middlewares/checkPermission')
const productController = require('../../../controllers/product/product.controller')

// Api to create new product (require Admin perrmission)
productRoute.post('/',
    verifyToken,
    checkPermission,
    uploadImageByMulter.single('productImage'),
    uploadImageToImgur,
    async (req, res, next) => {
        try {
            let productImage = req.productImageUrl
            let {name, price, salePrice, description} = req.body
            const result = await productController.create(name, price, salePrice, productImage, description)

            return res.status(200).json({message: 'create new product successfully', result})
        } catch (error) {
            console.log(error)
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

// Api to get product by name (with sort, page)
productRoute.get('/search', async (req, res, next) => {
    try {
        const name = req.query?.name,
            pageNum = req.query?.page,
            sortType = req.query?.sort

        const itemPerPage = 8
        const products = await productController.getByName(itemPerPage, pageNum, sortType, name)
        return res.status(200).json(products)
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
    uploadImageByMulter.single('productImage'),
    uploadImageToImgur,
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