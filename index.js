const express = require('express');
const path = require('path');
const clienteRoutes = require('./routes/clienteRoutes');
const citaRoutes = require('./routes/citaRoutes');

const app = express();

app.use(express.json());


app.use(express.static(path.join(__dirname, '../barberia-app')));


app.use('/api/v1', clienteRoutes);
app.use('/api/v1', citaRoutes);

// Puerto obligatorio 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor unificado corriendo en http://40.233.7.61:${PORT}`);
});