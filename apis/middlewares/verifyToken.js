'use strict'

const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const {authorization} = req.headers
    if (!authorization || authorization.indexOf('Bearer') !== 0) {
        return res.status(403).json({message: 'unauthorized'})
    }
    const accessToken = authorization.replace('Bearer ', '')

    const SECRET_KEY = process.env.SECRET_KEY
    jwt.verify(accessToken, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({message: 'unauthorized'})
        }
        req.userId = decoded.userId
        return next()
    })
}

module.exports = verifyToken