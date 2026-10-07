const db = require('../config/db'); 

const clienteController = {
  obtenerClientes: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM cliente');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  obtenerClientePorId: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  },

  crearCliente: async (req, res) => {
    const { nombre, telefono, correo } = req.body;

    // Validar solo los campos que son obligatorios en la BD
    if (!nombre || !correo) {
        return res.status(400).json({
            status: "error",
            message: "Bad Request: El nombre y el correo son obligatorios."
        });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO cliente (nombre, telefono, correo) VALUES (?, ?, ?)',
            [nombre, telefono || null, correo] // Si no mandan teléfono, se guarda como null
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
  actualizarCliente: async (req, res) => {
    const { nombre, telefono, correo } = req.body;
    const { id } = req.params;

    if (!nombre || !correo) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Bad Request: El nombre y el correo son obligatorios para actualizar.' 
        });
    }

    try {
      const [existing] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found: El cliente no existe' });
      }
      
      await db.query(
        'UPDATE cliente SET nombre = ?, telefono = ?, correo = ? WHERE id_cliente = ?',
        [nombre, telefono || null, correo, id]
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Registro actualizado correctamente'
      });
      
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
},

  eliminarCliente: async (req, res) => {
    const { id } = req.params;
    try {
      const [existing] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ status: 'error', message: 'Not Found' });
      }

      await db.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);
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

module.exports = clienteController;