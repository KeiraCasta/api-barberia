const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

router.get('/citas', citaController.obtenerCitas);
router.get('/citas/:id', citaController.obtenerCitaPorId);
router.post('/citas', citaController.crearCita);
router.put('/citas/:id', citaController.actualizarCita);
router.delete('/citas/:id', citaController.eliminarCita);

module.exports = router;