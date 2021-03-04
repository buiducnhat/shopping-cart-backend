'use strict'

const db = require('../../models')
const ProductModel = db.products
const CategoryModel = db.categories
const sortConfig = require('./sortConfig')

exports.create = (name, orignalPrice, salePrice, productImage, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentPrice = salePrice || orignalPrice
            let newProduct = new ProductModel({name, orignalPrice, salePrice, currentPrice, productImage, description})
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
            pageNum = pageNum || 1
            pageNum = parseInt(pageNum)
            sortType = sortType || sortConfig.sortTypeConfig.DES_UPDATE

            const categoriesFounded = await CategoryModel.find()

            const itemCount = await ProductModel.count()
            let productsFounded = await ProductModel.find()
                .sort(`${sortConfig.convert(sortType)}`)
                .limit(itemPerPage)
                .skip((pageNum - 1) * itemPerPage)

            return resolve({
                total: itemCount,
                data: productsFounded.map(product => {
                    const categoryName = categoriesFounded.find(category => category._id.toString() === product.categoryId.toString()).name
                    return ({
                        _id: product._id,
                        name: product.name,
                        productImage: product.productImage,
                        orignalPrice: product.orignalPrice,
                        salePrice: product.salePrice,
                        currentPrice: product.currentPrice,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        category: categoryName
                    })
                })
            })
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getByCategory = (itemPerPage, pageNum, sortType, categoryName) => {
    return new Promise(async (resolve, reject) => {
        try {
            pageNum = pageNum || 1
            pageNum = parseInt(pageNum)
            sortType = sortType || sortConfig.sortTypeConfig.DES_UPDATE

            const categoryFoundedId = (await CategoryModel.findOne({name: categoryName}, '_id'))?._id
            console.log(categoryFoundedId)

            const itemCount = await ProductModel.count({categoryId: categoryFoundedId})
            const productsFounded = await ProductModel.find({categoryId: categoryFoundedId})
                .sort(`${sortConfig.convert(sortType)}`)
                .limit(itemPerPage)
                .skip((pageNum - 1) * itemPerPage)

            return resolve({
                total: itemCount,
                data: productsFounded.map(product => {
                    return ({
                        _id: product._id,
                        name: product.name,
                        productImage: product.productImage,
                        orignalPrice: product.orignalPrice,
                        salePrice: product.salePrice,
                        currentPrice: product.currentPrice,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        category: categoryName
                    })
                })
            })
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
            pageNum = pageNum || 1
            pageNum = parseInt(pageNum)
            sortType = sortType || sortConfig.sortTypeConfig.DES_UPDATE
            name = name.toLowerCase()

            const allProducts = await ProductModel.find()
            const productsFounded = allProducts.filter(product => product.name.toLowerCase().includes(name))
            productsFounded.sort((a, b) => {
                switch (sortType) {
                    case sortConfig.sortTypeConfig.ASC_PRICE:
                        return b.currentPrice - a.currentPrice
                    case sortConfig.sortTypeConfig.DES_PRICE:
                        return a.currentPrice - b.currentPrice
                    case sortConfig.sortTypeConfig.ASC_UPDATE:
                        return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
                    case sortConfig.sortTypeConfig.DES_PRICE:
                        return Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
                }
            })

            return resolve({
                total: itemCount,
                data: productsFounded.map(product => {
                    return ({
                        _id: product._id,
                        name: product.name,
                        productImage: product.productImage,
                        orignalPrice: product.orignalPrice,
                        salePrice: product.salePrice,
                        currentPrice: product.currentPrice,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        category: categoryName
                    })
                })
            })
        } catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}

exports.updateById = (productId, name, orignalPrice, salePrice, productImage, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentPrice = salePrice || orignalPrice
            const result = await ProductModel.findByIdAndUpdate(productId, {name, orignalPrice, salePrice, currentPrice, productImage, description})
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