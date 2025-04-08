const express = require("express");
const passport = require("passport");
const router = express.Router();

const { isLoggedIn } = require("../middleware");
const { checkInitialBudget } = require("../helpers/initialBudgetStatus");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const initialBudget = await checkInitialBudget(req.user.id);

      let redirectUrl;

      if (initialBudget === null) {
        redirectUrl = process.env.FRONTEND_URL + "/set-budgets";
      } else {
        redirectUrl = process.env.FRONTEND_URL + "/expense-status";
      }

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("OAuth Error", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });

      res.clearCookie("connect.sid");
      res.json({ message: "Successfully logged out!" });
    });
  });
});

router.get("/user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ user: null });
  }

  return res.json({ user: req.user });
});

module.exports = router;
