const mongoose = require('mongoose');
const { type } = require('os');

const palapaSchema = new mongoose.Schema({
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

    capacidad:{
        type:Number,
        required:true
    },

    existencia:{
        type:Number,
        default:10
    }

})

const palapaModel = mongoose.model('bebidas',palapaSchema);

module.exports = palapaModel