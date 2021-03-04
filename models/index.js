'use strict'

const dbConfig = require('../config/db.config')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.dbUrl

db.users = require('./user/user.model')
db.products = require('./product/product.model')
db.categories = require('./category/category.model')
db.carts = require('./cart/cart.model')
db.orders = require('./order/order.model')

module.exports = db