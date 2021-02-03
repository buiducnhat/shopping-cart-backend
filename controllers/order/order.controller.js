'use strict'

const db = require('../../models')
const OrderModel = db.orders
const CartModel = db.carts
const ProductModel = db.products
const OrderStatus = require('../../models/order/orderStatus')

exports.getOrderOfUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ordersFounded = await OrderModel.find({userId})

            let ordersDetail = []

            for (let i = 0, length = ordersFounded.length; i < length; ++i) {
                let order = {
                    id: ordersFounded[i]._id,
                    name: ordersFounded[i].name,
                    phoneNumber: ordersFounded[i].phoneNumber,
                    address: ordersFounded[i].address,
                    status: ordersFounded[i].status,
                    items: [],
                    total: ordersFounded[i].total
                }
                for (let j = 0, length = ordersFounded[i].items.length; j < length; ++j) {
                    const item = ordersFounded[i].items[j]
                    const product = await ProductModel.findById(item.productId)
                    order.items.push({
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
                ordersDetail.push(order)
            }

            return resolve(ordersDetail)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.createOrder = (userId, name, phoneNumber, address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cartFounded = await CartModel.findOne({userId})
            if (!cartFounded) {
                return reject({status: 500, message: 'cannot order, cart is empty'})
            }

            let newOrder = new OrderModel({
                userId,
                name,
                phoneNumber,
                address,
                items: cartFounded.items,
                total: cartFounded.total,
                status: OrderStatus.active
            })
            await newOrder.save()

            // Empty cart after order
            await CartModel.findOneAndDelete({userId})

            return resolve(newOrder)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.cancelOrder = (userId, orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderFounded = await OrderModel.findById(orderId)

            if (!orderFounded) {
                return reject({status: 404, message: 'order not found'})
            }
            if (userId !== orderFounded.userId.toString()) {
                return reject({status: 403, message: 'unauthorized'})
            }
            if (orderFounded.status !== OrderStatus.active) {
                return reject({status: 500, message: 'cannot cancel this order'})
            }
            orderFounded.status = OrderStatus.cancelled
            await orderFounded.save()
            return resolve(orderFounded)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.completeOrder = (userId, orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orderFounded = await OrderModel.findById(orderId)

            if (!orderFounded) {
                return reject({status: 404, message: 'order not found'})
            }
            if (userId !== orderFounded.userId.toString()) {
                return reject({status: 403, message: 'unauthorized'})
            }
            if (orderFounded.status !== OrderStatus.active) {
                return reject({status: 500, message: 'cannot complete this order'})
            }
            orderFounded.status = OrderStatus.completed
            await orderFounded.save()
            return resolve(orderFounded)
        } catch (error) {
            return reject(error)
        }
    })
}