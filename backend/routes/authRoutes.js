require("dotenv").config();
const express = require("express");
const passport = require("passport");
const router = express.Router();

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_FRONTEND_URL
    : process.env.FRONTEND_URL;

const { isLoggedIn } = require("../middleware");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${FRONTEND_URL}/`,
    failureRedirect: `${FRONTEND_URL}/login`,
  })
);

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.clearCookie("connect.sid");
    res.json({ message: "Successfully logged out!" });
  });
});

router.get("/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ user: null });
  }

  res.json({ user: req.user });
});
module.exports = router;
