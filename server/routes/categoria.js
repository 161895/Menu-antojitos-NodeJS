const categoria = require('../models/categoria')
const express = require('express')
const Categoria = require('../models/categoria');
const _ = require('underscore')

const app = express()



//REGISTRA CATEGORIAS
app.post('/registrar', (req, res) => {
    let body = req.body;

    // CAMBIAR LA PRIMERA LATRA A MAYUSCULA Y LO DEMÁS A MINUSCULAS 
    let strNombre = '';
    var regex = new RegExp(["^", body.strNombre, "$"].join(""), "i");

    Categoria.find({ 'strNombre': regex }).then((categoria) => {

        console.log(categoria);
        if (categoria.length > 0) {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'La categoría ya existe, favor registrar otra.',
            });
        }
        strNombre = body.strNombre.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

        let categorias = new Categoria({
            strNombre: strNombre,
            strDescripcion: body.strDescripcion,
            blnEstatus: body.blnEstatus
        });
        Categoria.findOne({ 'strNombre': strNombre }).then((encontrado) => {

            if (encontrado) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    msg: 'Esta categoría ya existe'
                });
            }
            new Categoria(categorias).save().then(resp => {
                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'La categoría se ha registrado correctamente',
                    cont: resp
                });
            }).catch(err => {
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'Error al registrar la categoría',
                    err: Object.keys(err).length === 0 ? err.message : err
                });
            });

        });
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({
            ok: false,
            status: 400,
            msg: 'Ha ocurrido un error con el servidor',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    });
});

//OTENER CATEGORIAS

app.get('/obtener', (req, res) => {
    Categoria.find().then((categoria) => {

        if (categoria.length <= 0) {
            return res.status(400).json({
                ok: false,
                status: 404,
                msg: 'Error al intenar obtener las categorias',

            });
        }
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se han obtenido correctamente las categorias',
            count: categoria.length,
            cont: categoria
        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al intenar obtener las categorias',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    })
});




app.get('/obtener/:id', (req, res) => {
    let id = req.params.id;
    Categoria.find({ _id: id })
        .then((categoria) => {
            if (categoria.length <= 0) {
                return res.status(404).json({
                    ok: false,
                    status: 404,
                    msg: 'Esta categoria no existe en la base de datos',
                });
            }
            return res.status(200).json({
                ok: true,
                status: 200,
                msg: 'Se ha consultado correctamente la categoria',
                count: categoria.length,
                cont: categoria
            });

        }).catch((err) => {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'Error al obtener la categoria',
                err: Object.keys(err).length === 0 ? err.message : err
            });
        })
});



//MODIFICAR CATEGORIA

app.put('/modificar/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['strNombre', 'strDescripcion', 'blnEstatus']);
    console.log(req.body);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .then((categoriaDB) => {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'El catalogo se ha actualizado exitosamente.',
                cont: categoriaDB
            });

        }).catch((err) => {
            return res.status(400).json({
                ok: false,
                err: Object.keys(err).length === 0 ? err.message : err
            });

        })
});



app.delete('/eliminar/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, { blnEstatus: false }, { new: true, runValidators: true, context: 'query' }).then((resp) => {
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se ha desactivado correctamente el catalogo',
            cont: resp

        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al desactivar el catalogo',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    });
});


app.delete('/activar/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, { blnEstatus: true }, { new: true, runValidators: true, context: 'query' }).then((resp) => {
        return res.status(200).json({
            ok: true,
            status: 200,
            msg: 'Se ha activado correctamente el catalogo',
            cont: resp

        });
    }).catch((err) => {
        return res.status(400).json({
            ok: false,
            status: 400,
            msg: 'Error al activar el catalogo',
            err: Object.keys(err).length === 0 ? err.message : err
        });
    });
});

module.exports = app