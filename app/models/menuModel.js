const mongoose = require('mongoose');
const { type } = require('os');

const comidaSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    descripcion:{
        type:String,
        required:true
    },

    precios:{
        type:Number,
        required:true
    },

    imagenURL:{
        type:String,
        required:true
    }
})

const menuModel = mongoose.model('menu', comidaSchema);

module.exports = menuModel