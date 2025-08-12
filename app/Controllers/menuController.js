const path = require('path');
const fs = require('fs').promises;
const menuModel = require('../models/menuModel');

async function buscarTodo(req, res) {
  try {
    const platillos = await menuModel.find({});
    if (platillos.length) return res.status(200).send({ platillos });
    return res.status(204).send({ message: 'No hay platillos en la base de datos' });
  } catch (e) {
    return res.status(500).send({ message: `Error al solicitar la información: ${e.message}` });
  }
}

async function agregar(req, res) {
  try {
    console.log('=== DEBUG INFO agregar ===');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: 'No se recibió el cuerpo de la solicitud.' });
    }

    const { name, descripcion, precios } = req.body;
    const imagenURL = req.file ? `/uploads/${req.file.filename}` : '';

    if (!name || !descripcion || !precios || !imagenURL) {
      return res.status(400).send({ message: 'Faltan campos requeridos.' });
    }

    const nuevoPlatillo = new menuModel({ name, descripcion, precios, imagenURL });
    const info = await nuevoPlatillo.save();

    return res.status(201).send({ message: 'La información se guardó con éxito', info });
  } catch (e) {
    console.error('Error al agregar platillo:', e);
    return res.status(500).send({ message: `Error al guardar la información: ${e.message}` });
  }
}

function buscarPlatillo(req, res, next) {
  if (!req.body) req.body = {};
  const consulta = {};
  consulta[req.params.key] = req.params.value;

  menuModel.find(consulta)
    .then(platillos => {
      if (!platillos.length) return next();
      req.body.platos = platillos;
      return next();
    })
    .catch(e => {
      req.body.e = e;
      return next();
    });
}

function mostrarPlatillo(req, res) {
  const platillos = req.body.platos;
  if (req.body.e) return res.status(404).send({ message: 'Error al consultar la información' });
  if (!platillos) return res.status(204).send({ message: 'No hay información que mostrar' });
  return res.status(200).send({ platos: platillos });
}

async function eliminarPlatillo(req, res) {
  const platillos = req.body.platos;
  if (!platillos || !platillos.length) return res.status(404).send({ message: 'Platillo no encontrado' });

  const platillo = platillos[0];
  try {
    if (platillo.imagenURL) {
      const imagePath = path.join(__dirname, '../..', platillo.imagenURL);
      try { await fs.unlink(imagePath); console.log(`Imagen eliminada: ${imagePath}`); } catch (err) { console.error(`Error al eliminar la imagen: ${imagePath}`, err); }
    }

    await menuModel.deleteOne({ _id: platillo._id });
    return res.status(200).send({ message: 'Platillo eliminado con éxito', deletedId: platillo._id });
  } catch (e) {
    console.error('Error al eliminar platillo:', e);
    return res.status(500).send({ message: `Error al eliminar el platillo: ${e.message}` });
  }
}

// NUEVA función: actualizarPlatillo busca por nombre (req.params.name) y admite imagen opcional
async function actualizarPlatillo(req, res) {
  const originalName = req.params.name;

  try {
    const platillo = await menuModel.findOne({ name: originalName });
    if (!platillo) {
      return res.status(404).send({ message: 'No se encontró el platillo para actualizar' });
    }

    // Campos enviados (si vienen vacíos no los sobreescribimos)
    const { name, descripcion } = req.body;
    let { precios } = req.body; // puede venir como string

    // Si multer procesó un archivo -> req.file
    if (req.file) {
      const newImagenURL = `/uploads/${req.file.filename}`;

      // Si había imagen anterior, intentar eliminarla
      if (platillo.imagenURL && platillo.imagenURL !== newImagenURL) {
        const imagePath = path.join(__dirname, '../..', platillo.imagenURL);
        try {
          await fs.unlink(imagePath);
          console.log(`Imagen anterior eliminada: ${imagePath}`);
        } catch (err) {
          console.error(`No se pudo eliminar la imagen anterior: ${imagePath}`, err);
        }
      }

      platillo.imagenURL = newImagenURL;
    }

    if (typeof name !== 'undefined' && name !== '') platillo.name = name;
    if (typeof descripcion !== 'undefined' && descripcion !== '') platillo.descripcion = descripcion;
    if (typeof precios !== 'undefined' && precios !== '') platillo.precios = precios;

    const info = await platillo.save();

    return res.status(200).send({ message: 'Platillo actualizado con éxito', info });
  } catch (e) {
    console.error('Error al actualizar platillo:', e);
    return res.status(500).send({ message: `Error al actualizar el platillo: ${e.message}` });
  }
}

module.exports = {
  buscarTodo,
  agregar,
  buscarPlatillo,
  mostrarPlatillo,
  eliminarPlatillo,
  actualizarPlatillo
};
