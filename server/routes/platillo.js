const express = require('express');
const Platillo = require('../models/platillo');
const _ = require('underscore')
const { request } = require('./categoria');
const app = express()



//REGISTRA PLATILLOS
app.post('/registrar', (req, res) => {
    let body = req.body;

    // CAMBIAR LA PRIMERA LATRA A MAYUSCULA Y LO DEMÁS A MINUSCULAS 
    let strNombre = '';
    var regex = new RegExp(["^", body.strNombre, "$"].join(""), "i");

    Platillo.find({ 'strNombre': regex }).then((platillo) => {

        console.log(platillo);
        if (platillo.length > 0) {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'El platillo ya existe, favor registrar otro.',
            });
        }
        strNombre = body.strNombre.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

        let platillos = new Platillo({
            strNombre: strNombre,
            strDescripcion: body.strDescripcion,
            strIngredientes: body.strIngredientes,
            nmbPiezas: body.nmbPiezas,
            nmbPrecio: body.nmbPrecio,
            blnEstatus: body.blnEstatus
        });
        Platillo.findOne({ 'strNombre': strNombre }).then((encontrado) => {

            if (encontrado) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    msg: 'Este platillo ya existe'
                });
            }
            new Platillo(platillos).save().then(resp => {
                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'El platillo se ha registrado correctamente',
                    cont: resp
                });
            }).catch(err => {
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'Error al registrar el platillo',
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

//OTENER PLATILLOS

app.get('/obtener/:idCategoria', (req, res) => {
    Platillo.find({ idCategoria: req.params.idCategoria }).populate('categoria')

    exec((err, platillos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.status(200).json({
            ok: true,
            count: platillos.length,
            cont: platillos
        });

    });




    app.get('/obtenerId/:id', (req, res) => {
        let id = req.params.id;
        Platillo.find({ _id: id })
            .then((platillo) => {
                if (platillo.length <= 0) {
                    return res.status(404).json({
                        ok: false,
                        status: 404,
                        msg: 'Este platillo no existe en la base de datos',
                    });
                }
                return res.status(200).json({
                    ok: true,
                    status: 200,
                    msg: 'Se ha consultado correctamente el platillo',
                    count: categoria.length,
                    cont: categoria
                });

            }).catch((err) => {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    msg: 'Error al obtener el platillo',
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
                    msg: 'El platillo se ha actualizado exitosamente.',
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
                msg: 'Se ha desactivado correctamente el platillo',
                cont: resp

            });
        }).catch((err) => {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'Error al desactivar el platillo',
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
                msg: 'Se ha activado correctamente el platillo',
                cont: resp

            });
        }).catch((err) => {
            return res.status(400).json({
                ok: false,
                status: 400,
                msg: 'Error al activar el platillo',
                err: Object.keys(err).length === 0 ? err.message : err
            });
        });
    });
});

module.exports = app