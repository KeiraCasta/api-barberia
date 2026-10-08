const db = require('../config/db');

const servicioController = {
  obtenerServicios: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM servicio');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  obtenerServicioPorId: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM servicio WHERE id_servicio = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  crearServicio: async (req, res) => {
    const { nombre, precio } = req.body;

    // Ambos campos son obligatorios (NOT NULL)
    if (!nombre || precio === undefined || precio === null) {
        return res.status(400).json({
            status: "error",
            message: "Bad Request: El nombre y el precio son obligatorios."
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO servicio (nombre, precio) VALUES (?, ?)',
            [nombre, precio]
        );
        res.status(201).json({
            status: "success",
            message: "Registro creado exitosamente",
            id: result.insertId
        });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
  },

  actualizarServicio: async (req, res) => {
    const { nombre, precio } = req.body;
    const { id } = req.params;

    if (!nombre || precio === undefined || precio === null) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Bad Request: El nombre y el precio son obligatorios para actualizar.' 
        });
    }

    try {
      const [existing] = await db.query('SELECT * FROM servicio WHERE id_servicio = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found: El servicio no existe' });
      }
      
      await db.query(
        'UPDATE servicio SET nombre = ?, precio = ? WHERE id_servicio = ?',
        [nombre, precio, id]
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente'
      });
      
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  },

  eliminarServicio: async (req, res) => {
    const { id } = req.params;
    try {
      const [existing] = await db.query('SELECT * FROM servicio WHERE id_servicio = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }

      await db.query('DELETE FROM servicio WHERE id_servicio = ?', [id]);
      res.status(200).json({
        status: 'success',
        message: 'Registro eliminado correctamente'
      });
    } catch (error) {
        console.error("Error en DELETE:", error); 
        res.status(500).json({ status: 'error', message: error.message }); 
    }
  }
};

module.exports = servicioController;