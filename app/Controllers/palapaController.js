const { response } = require('express')
const palapaModel = require('../models/palapaModel')

function buscarTodo(req, res){
    palapaModel.find({})
    .then(bebidas => {
        if(bebidas.length){
            return res.status(200).send({bebidas})
        }
        return res.status(204).send({
            message: 'No hay bebidas en la base de datos'
        })
    })
    .catch (e => {
            return res.status(404).send({
                message: `Error al solicitar la informacion ${e}`
        })
    })
}

function agregar(req, res) {
    new palapaModel(req.body).save()
    .then(info => {
        return res.status(200).send({
            message: "La informacion se guardo con exito",
            info
        })
    })
    .catch(e => {
        return res.status(404).send({
            message: `error al guardar la infomacion ${e}`
        })
    })
}

function buscarBebida(req, res, next) {
    if(!req.body)req.body={}
    let consulta = {}
    consulta[req.params.key]=req.params.value
    console.log (consulta)
    palapaModel.find(consulta)
    .then(bebidas => {
        if (!bebidas.length) return next
        req.body.bebidas = bebidas
        return next()
    })
    .catch (e => {
        req.body.e = e
        return next()
    })
}

function mostrarBebida(req, res) {
    let bebidas = req.body.bebidas

    if (req.body.e) return res.status(404).send({
        message: "Error al consultar la informacion"
    })

    if (!bebidas) return res.status(204).send({
        message: "No hay informacion que mostrar"
    })
    
    return res.status(200).send({bebidas})
}

function eliminarBebida(req, res) {
    var bebidas = {}
    bebidas= req.body.bebidas
    palapaModel.deleteOne(bebidas[0])
    .then(info => {
        return res.status(200).send({
            message: "bebida eliminada con exito"
        })
    })
    .catch(e => {
        return res.status(404).send({
            message: `error al eliminar la bebida ${e}`
        })
    })
}

function actualizarBebida(req, res) {
    const bebidas = req.body.bebidas;
    const nuevaData = req.body;

    if (!bebidas || !bebidas.length) {
        return res.status(404).send({
            message: "No se encontró la bebida para actualizar"
        });
    }

    palapaModel.updateOne(
        { nombre: bebidas[0].nombre },  
        nuevaData                      
    )
    .then(info => {
        if (info.modifiedCount === 0) {
            return res.status(200).send({
                message: "No se realizaron cambios (ya estaba actualizado)"
            });
        }

        return res.status(200).send({
            message: "Bebida actualizada con éxito", info
        });
    })
    .catch(e => {
        return res.status(404).send({
            message: `Error al actualizar la bebida: ${e}`
        });
    });    
}


module.exports = {
    actualizarBebida,
    buscarTodo,
    eliminarBebida,
    agregar,
    buscarBebida,
    mostrarBebida
}