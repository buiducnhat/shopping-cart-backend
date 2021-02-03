'use strict'

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const path = require('path')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const productRoute = require('./apis/routes/product/product.route')
const userRoute = require('./apis/routes/user/user.route')
const cartRoute = require('./apis/routes/cart/cart.route')
const orderRoute = require('./apis/routes/order/order.route')
app.use('/products', productRoute)
app.use('/users', userRoute)
app.use('/carts', cartRoute)
app.use('/orders', orderRoute)

const db = require('./models')
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log(`Connected to the database`)
    })
    .catch(err => {
        console.log('Cannot connect to the database!', err)
        process.exit()
    })

module.exports = app