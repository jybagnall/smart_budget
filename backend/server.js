require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

require("./config/passportConfig");
const sessionMiddleware = require("./config/sessionConfig");

const passport = require("passport");

app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.user) {
    req.session.user = req.user;
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/form", formRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  const statusCode = err.status || 500;
  return res
    .status(statusCode)
    .json({ message: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
