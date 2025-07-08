const express = require('express');
const router = express.Router();
const palapaController = require('../Controllers/palapaController');

router.get('/bebidas', palapaController.buscarTodo);
router.post('/bebidas', palapaController.agregar)

module.exports = router;