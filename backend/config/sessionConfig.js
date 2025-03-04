require("dotenv").config();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const sessionStore = new MySQLStore({
  host: process.env.DOCKERIZED === "true" ? "mysql" : process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000,
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "play him off, keyboard cat!",
  resave: false,
  saveUninitialized: false,
  store: sessionStore, // store session in MySQL
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

module.exports = sessionMiddleware;
