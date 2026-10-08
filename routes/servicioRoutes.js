const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

router.get('/servicios', servicioController.obtenerServicios);
router.get('/servicios/:id', servicioController.obtenerServicioPorId);
router.post('/servicios', servicioController.crearServicio);
router.put('/servicios/:id', servicioController.actualizarServicio);
router.delete('/servicios/:id', servicioController.eliminarServicio);

module.exports = router;