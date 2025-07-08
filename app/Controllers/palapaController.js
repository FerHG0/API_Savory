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
    //console.log(req.body)
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

module.exports = {
    buscarTodo,
    agregar
}