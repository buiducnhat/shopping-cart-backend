'use strict'

const db = require('../../models')
const CategoryModel = db.categories

exports.create = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await CategoryModel.create({name})
            return resolve(result)
        } catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}

exports.getAll = () => {
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await CategoryModel.find()
            return resolve(result)
        } catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}

exports.deleteById = (categoryId) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const result = await CategoryModel.findByIdAndDelete(categoryId)
            return resolve(result)
        } catch (error) {
            console.log(error)
            return reject(error)
        }
    })
}