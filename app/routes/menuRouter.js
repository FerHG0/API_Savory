const express = require('express');
const router = express.Router();
const menuController = require('../Controllers/menuController');
const upload = require('../Middlewares/uploadMiddleware')

router.get('/menu', menuController.buscarTodo);
router.post('/menu', upload.single('imagen'), menuController.agregar);
router.get('/menu/:key/:value', menuController.buscarPlatillo, menuController.mostrarPlatillo);
router.delete('/menu/:key/:value', menuController.buscarPlatillo, menuController.eliminarPlatillo);
router.patch(
  '/menu/:name',
  (req, res, next) => {
    const contentType = (req.headers['content-type'] || '');
    if (contentType.includes('multipart/form-data')) {
      upload.single('imagen')(req, res, next);
    } else {
      // Si no, pasar al controller directamente
      next();
    }
  },
  menuController.actualizarPlatillo
);

module.exports = router;