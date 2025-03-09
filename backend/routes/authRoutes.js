const express = require("express");
const passport = require("passport");
const router = express.Router();

const pool = require("../config/db");
const { isLoggedIn } = require("../middleware");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL + "/",
    failureRedirect: process.env.FRONTEND_URL + "/login",
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

  return res.json({ user: req.user });
});

router.get("/check-budget", isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    const budget_exists_q =
      "SELECT target_amount FROM budgets JOIN dates ON budgets.date_id = date.id WHERE budgets.user_id=? AND dates.year= YEAR(CURDATE()) AND dates.month = MONTH(CURDATE())";

    const [budget] = await pool.execute(budget_exists_q, [userId]);

    if (budget.length > 0) {
      return res.json({ hasBudget: true });
    } else {
      return res.json({ hasBudget: false });
    }
  } catch (e) {
    console.error("Error checking budget:", e);

    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
