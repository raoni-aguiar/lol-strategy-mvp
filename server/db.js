// server/db.js
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Transforma o pool para usar Promises (permite usar async/await no index.js)
const promisePool = pool.promise();

console.log(`🔌 Conectado ao banco: ${process.env.DB_NAME}`);

module.exports = promisePool;