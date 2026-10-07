const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'app_admin',
  password: 'Admin123',
  database: 'barberia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();