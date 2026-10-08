const express = require('express');
const router = express.Router();
const barberoController = require('../controllers/barberoController');

router.get('/barberos', barberoController.obtenerBarberos);
router.get('/barberos/:id', barberoController.obtenerBarberoPorId);
router.post('/barberos', barberoController.crearBarbero);
router.put('/barberos/:id', barberoController.actualizarBarbero);
router.delete('/barberos/:id', barberoController.eliminarBarbero);

module.exports = router;