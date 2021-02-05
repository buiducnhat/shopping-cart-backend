'use strict'

const axios = require('axios').default
const fs = require('fs')
const FormData = require('form-data')

const uploadImageToImgur = async (req, res, next) => {
    try {
        const url = 'https://api.imgur.com/3/upload'
        const data = new FormData()
        data.append('image', fs.createReadStream(req.file.path))
        fs.unlinkSync(req.file.path)

        const response = await axios.post(url, data, {headers:{...data.getHeaders()}})
        
        const result = response.data

        req.productImageUrl = result.data.link
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

module.exports = uploadImageToImgur