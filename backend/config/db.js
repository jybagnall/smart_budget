require("dotenv").config();
const mysql = require("mysql2/promise");

const isProduction = process.env.NODE_ENV === "production";

const pool = mysql.createPool({
  host:
    process.env.DOCKERIZED === "true"
      ? "mysql" // Docker service name
      : process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  //acquireTimeout: 20000,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Successfully connected to MySQL database!");

    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;
