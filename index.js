'use strict'

const app = require('./server')
const config = require('./config')

const PORT = config.serverSettings.serverPort
app.listen(PORT, () => {
    console.log(`Server list on port ${PORT}`)
})
