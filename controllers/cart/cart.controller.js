'use strict'

const db = require('../../models')
const CartModel = db.carts
const ProductModel = db.products

exports.cart = (userId, productId, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            quantity = Number.parseInt(quantity)
            const productFounded = await ProductModel.findById(productId)
            if (!productFounded) {
                return reject({message: 'product not found'})
            }
            const cartFounded = await CartModel.findOne({userId})
            // Case this user had not had cart before
            if (!cartFounded) {
                let newCart = new CartModel({
                    userId,
                    items: [{productId, quantity}],
                    total: productFounded.salePrice * quantity
                })
                newCart = await newCart.save()

                return resolve(newCart)
            } else {
                let isExistedProduct = false
                for (let i = 0, length = cartFounded.items.length; i < length; ++i) {
                    if (cartFounded.items[i].productId.toString() === productId) {
                        cartFounded.items[i].quantity += quantity
                        isExistedProduct = true
                        break
                    }
                }
                // Case the product had not been in cart before
                if (!isExistedProduct) {
                    cartFounded.items.push({productId, quantity})
                }
                cartFounded.total += productFounded.salePrice * quantity
                await cartFounded.save()
                return resolve(cartFounded)
            }
        } catch (error) {
            return reject(error)
        }
    })
}

exports.updateCart = (userId, items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let total = 0
            for (let i = 0, length = items.length; i < length; i++) {
                total += items[i].subTotal
            }
            const result = await CartModel.findOneAndUpdate({userId}, {items, total})

            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.deleteCart = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await CartModel.findOneAndDelete({userId})

            return resolve(result)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getCartInfo = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cartFounded = await CartModel.findOne({userId})
            if (!cartFounded) {
                return resolve(null)
            }
            let cartDetail = {
                userId,
                items: [],
                total: cartFounded.total,
                createdAt: cartFounded.createdAt,
                updatedAt: cartFounded.updatedAt
            }
            for (let i = 0, length = cartFounded.items.length; i < length; ++i) {
                const item = cartFounded.items[i]
                const product = await ProductModel.findById(item.productId)
                cartDetail.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    salePrice: product.salePrice,
                    productImage: product.productImage,
                    description: product.description,
                    quantity: item.quantity,
                    subTotal: product.price * item.quantity
                })
            }
            return resolve(cartDetail)
        } catch (error) {
            return reject(error)
        }
    })
}