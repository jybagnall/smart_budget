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

const allowedOrigins = [
  process.env.FRONTEND_URL, // local front
  process.env.PRODUCTION_FRONTEND_URL || "",
].filter(Boolean); // remove empty values

// * allows all origins to avoid CORS errors
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  return res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
