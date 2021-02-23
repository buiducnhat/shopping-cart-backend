'use strict'

const sortTypeConfig = {
    ASC_PRICE: 'asc-price',
    DES_PRICE: 'des-price',
    ASC_UPDATE: 'asc-update',
    DES_UPDATE: 'des-update'
}

const convert = (sortType) => {
    switch (sortType) {
        case sortTypeConfig.ASC_PRICE:
            return 'currentPrice'
        case sortTypeConfig.DES_PRICE:
            return '-currentPrice'
        case sortTypeConfig.ASC_UPDATE:
            return 'updatedAt'
        case sortTypeConfig.DES_UPDATE:
            return '-updatedAt'
        default:
            return '-updatedAt'
    }
}

module.exports = Object.assign({}, {sortTypeConfig, convert})