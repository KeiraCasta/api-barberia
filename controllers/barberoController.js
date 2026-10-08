const db = require('../config/db');

const barberoController = {
  obtenerBarberos: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM barbero');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  obtenerBarberoPorId: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM barbero WHERE id_barbero = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  crearBarbero: async (req, res) => {
    const { nombre, especialidad } = req.body;

    // Ambos campos son NOT NULL en la base de datos
    if (!nombre || !especialidad) {
        return res.status(400).json({
            status: "error",
            message: "Bad Request: El nombre y la especialidad son obligatorios."
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO barbero (nombre, especialidad) VALUES (?, ?)',
            [nombre, especialidad]
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

  actualizarBarbero: async (req, res) => {
    const { nombre, especialidad } = req.body;
    const { id } = req.params;

    if (!nombre || !especialidad) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Bad Request: El nombre y la especialidad son obligatorios para actualizar.' 
        });
    }

    try {
      const [existing] = await db.query('SELECT * FROM barbero WHERE id_barbero = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found: El barbero no existe' });
      }
      
      await db.query(
        'UPDATE barbero SET nombre = ?, especialidad = ? WHERE id_barbero = ?',
        [nombre, especialidad, id]
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente'
      });
      
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  },

  eliminarBarbero: async (req, res) => {
    const { id } = req.params;
    try {
      const [existing] = await db.query('SELECT * FROM barbero WHERE id_barbero = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }

      await db.query('DELETE FROM barbero WHERE id_barbero = ?', [id]);
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

module.exports = barberoController;