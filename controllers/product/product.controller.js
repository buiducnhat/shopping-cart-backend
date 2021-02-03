'use strict'

const db = require('../../models')
const ProductModel = db.products
const sortConfig = require('./sortConfig')

exports.create = (name, price, salePrice, productImage, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newProduct = new ProductModel({name, price, salePrice, productImage, description})
            const result = await newProduct.save(newProduct)
            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getAll = (itemPerPage, pageNum, sortType) => {
    return new Promise(async (resolve, reject) => {
        try {
            pageNum = pageNum ? pageNum : 1
            pageNum = parseInt(pageNum)
            sortType = sortType ? sortType : sortConfig.sortTypeConfig.DES_UPDATE

            const result = await ProductModel.find()
                .sort(`${sortConfig.convert(sortType)}`)
                .limit(itemPerPage)
                .skip((pageNum - 1) * itemPerPage)

            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getById = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = ProductModel.findById(productId).exec()
            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.updateById = (productId, name, price, salePrice, productImage, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await ProductModel.findByIdAndUpdate(productId, {name, price, salePrice, productImage, description})
            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.deleteById = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await ProductModel.findByIdAndDelete(productId)
            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}