const palapaModel = require('../models/palapaModel')

function buscarTodo(req, res){
    palapaModel.find({})
    .then(bebidas => {
        if(bebidas.length){
            return res.status(200).send({bebidas})
        }
        return res.status(204).send({message: 'No hay bebidas en la base de datos'})
    })
    .catch (e => {
            return res.status(404).send({message: `Error al solicitar la informacion ${e}`
        })
    })
}

module.exports = {
    buscarTodo
}