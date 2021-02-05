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

            const productsFounded = await ProductModel.find()
                .sort(`${sortConfig.convert(sortType)}`)
                .limit(itemPerPage)
                .skip((pageNum - 1) * itemPerPage)

            return resolve(productsFounded)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getById = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const productFounded = ProductModel.findById(productId).exec()
            return resolve(productFounded)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getByName = (itemPerPage, pageNum, sortType, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            pageNum = pageNum ? pageNum : 1
            pageNum = parseInt(pageNum)
            sortType = sortType ? sortType : sortConfig.sortTypeConfig.DES_UPDATE
            name = name.toLowerCase()
            console.log(name)
            const allProducts = await ProductModel.find()
            const productsFounded = allProducts.filter(product => product.name.toLowerCase().includes(name))
            console.log(productsFounded)
            productsFounded.sort((a, b) => {
                switch (sortType) {
                    case sortConfig.sortTypeConfig.ASC_PRICE:
                        return b.price - a.price
                    case sortConfig.sortTypeConfig.DES_PRICE:
                        return a.price - b.price
                    case sortConfig.sortTypeConfig.ASC_UPDATE:
                        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
                    case sortConfig.sortTypeConfig.DES_PRICE:
                        return Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
                }
            })

            return resolve(productsFounded)
        } catch (error) {
            console.log(error)
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