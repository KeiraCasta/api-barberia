const db = require('../config/db');

const citaController = {
  obtenerCitas: async (req, res) => {
    try {
      const query = `
        SELECT c.id_cita, c.fecha_hora, c.estado, 
               cl.nombre AS cliente, b.nombre AS barbero
        FROM cita c
        JOIN cliente cl ON c.id_cliente = cl.id_cliente
        JOIN barbero b ON c.id_barbero = b.id_barbero
      `;
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  obtenerCitaPorId: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM cita WHERE id_cita = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  crearCita: async (req, res) => {
    const { fecha_hora, estado, id_cliente, id_barbero } = req.body;

    if (!fecha_hora || !id_cliente || !id_barbero) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Bad Request: fecha_hora, id_cliente e id_barbero son obligatorios.' 
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO cita (fecha_hora, estado, id_cliente, id_barbero) VALUES (?, ?, ?, ?)',
            [fecha_hora, estado || 'Pendiente', id_cliente, id_barbero]
        );
        res.status(201).json({
            status: 'success',
            message: 'Cita creada exitosamente',
            id: result.insertId
        });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
},

  actualizarCita: async (req, res) => {
    const { fecha_hora, estado, id_cliente, id_barbero } = req.body;
    const { id } = req.params;

    if (!fecha_hora || !id_cliente || !id_barbero) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Bad Request: fecha_hora, id_cliente e id_barbero son obligatorios para actualizar.' 
        });
    }

    try {
        const [existing] = await db.query('SELECT * FROM cita WHERE id_cita = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Not Found: La cita no existe' });
        }
        
        await db.query(
            'UPDATE cita SET fecha_hora = ?, estado = ?, id_cliente = ?, id_barbero = ? WHERE id_cita = ?',
            [fecha_hora, estado || 'Pendiente', id_cliente, id_barbero, id]
        );
        
        res.status(200).json({
            status: 'success',
            message: 'Cita actualizada correctamente'
        });
        
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
},
  eliminarCita: async (req, res) => {
    const { id } = req.params;
    try {
      const [existing] = await db.query('SELECT * FROM cita WHERE id_cita = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }

      await db.query('DELETE FROM cita WHERE id_cita = ?', [id]);
      res.status(200).json({
        status: 'success',
        message: 'Cita eliminada correctamente'
      });
    } catch (error) {
        console.error("Error en DELETE:", error); 
        res.status(500).json({ status: 'error', message: error.message }); 
    }
  }
};

module.exports = citaController;