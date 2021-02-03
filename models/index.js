'use strict'

const dbConfig = require('../config/db.config')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.dbUrl

db.products = require('./product/product.model')
db.users = require('./user/user.model')
db.carts = require('./cart/cart.model')
db.orders = require('./order/order.model')

module.exports = db