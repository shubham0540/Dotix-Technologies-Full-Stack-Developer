const mysql = require("mysql2");

const dbUser = process.env.DB_USER || process.env.DB_USERNAME;
const dbName = process.env.DB_NAME || process.env.DB_DATABASE;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: dbUser,
  password: process.env.DB_PASSWORD,
  database: dbName,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  }
});

module.exports = db;
