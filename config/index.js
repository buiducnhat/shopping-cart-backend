'use strict'

const dbSettings = require('./db.config')
const serverSettings = require('./server.config')

module.exports = Object.assign({}, {dbSettings, serverSettings})