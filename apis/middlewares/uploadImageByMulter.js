'use strict'

const multer = require('multer')

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb({message: 'upload only image file'}, false)
    }
}

const storage = multer.memoryStorage()

const uploadImageByMulter = multer({storage: storage, fileFilter: imageFilter})

module.exports = uploadImageByMulter
