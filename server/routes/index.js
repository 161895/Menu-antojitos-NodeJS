const express = require('express')
const app = express()


app.use('/categoria', require('./categoria'))
app.use('/platillo', require('./platillo'))


module.exports = app;