'use strict'

const userController = require('../../controllers/user/user.controller')

const checkAdminPermission = (req, res, next) => {
    const userId = req.userId
    userController.getInformation(userId)
        .then(userData => {
            if (userData.role === 'admin') {
                return next()
            }
            return res.status(403).json({message: 'unauthorized'})
        }).catch(error => {
            return res.status(500).json(error)
        })
}

module.exports = checkAdminPermission