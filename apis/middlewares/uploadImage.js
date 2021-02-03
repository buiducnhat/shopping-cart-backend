'use strict'

const multer = require('multer')
const path = require('path')

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb({message: 'upload only image file'}, false)
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../../public/images`)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadImageFile = multer({storage: storage, fileFilter: imageFilter})

module.exports = uploadImageFile
