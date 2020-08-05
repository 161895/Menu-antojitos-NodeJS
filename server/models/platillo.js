const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Categoria = require('./categoria');



const platilloSchema = new mongoose.Schema({
    idCategoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
    },
    strNombre: {
        type: String,
        unique: true,
    },

    strDescripcion: {
        type: String,
    },
    strIngredientes: {
        type: String,
    },
    nmbPiezas: {
        type: Number,
    },
    nmbPrecio: {
        type: Number,
    },
    blnEstatus: {
        type: Boolean,
    }
})

module.exports = mongoose.model('platillo', platilloSchema);