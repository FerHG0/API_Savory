const express = require('express');
const router = express.Router();
const palapaController = require('../Controllers/palapaController');

router.get('/bebidas', palapaController.buscarTodo)
.post('/bebidas', palapaController.agregar)
.get ('/bebidas/:key/:value', palapaController.buscarBebida, palapaController.mostrarBebida)
.delete('/bebidas/:key/:value', palapaController.buscarBebida, palapaController.eliminarBebida)
.patch('/bebidas/:key/:value', palapaController.buscarBebida, palapaController.actualizarBebida);
module.exports = router;