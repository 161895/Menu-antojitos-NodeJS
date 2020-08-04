const mongoose = require('mongoose')



const categoriaSchema = new mongoose.Schema({
    strNombre: {
        type: String,


    },

    strDescripcion: {
        type: String,
    },
    blnEstatus: {
        type: Boolean,
    }
})

module.exports = mongoose.model('categoria', categoriaSchema)