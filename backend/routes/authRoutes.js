const express = require("express");
const passport = require("passport");
const router = express.Router();

const pool = require("../config/db");
const { isLoggedIn } = require("../middleware");
const { checkUserBudget } = require("../helpers/budgetStatus");

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
router.get(
  "/google",
  (req, res, next) => {
    console.log("📢 Google OAuth Initiated");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  async (req, res) => {
    try {
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
            console.log("✅ Google OAuth Callback Triggered");

            if (!req.user) {
              console.error(
                "❌ No user found in request after authentication!"
              );
              return res.status(401).json({ message: "Unauthorized" });
            }

            console.log("✅ Authenticated User:", req.user);

            const userId = req.user.id;
            const { currentMonthExists, futureBudget } = await checkUserBudget(
              userId
            );

            console.log("✅ Budget Check Results:", {
              currentMonthExists,
              futureBudget,
            });

            let redirectUrl;

            if (currentMonthExists) {
              redirectUrl = process.env.FRONTEND_URL + "/expense-status";
            } else if (futureBudget) {
              redirectUrl = `${process.env.FRONTEND_URL}/expense-status`; // fix
              // expense-status?year=${futureBudget.year}&month=${futureBudget.month}`
            } else {
              redirectUrl = process.env.FRONTEND_URL + "/set-budgets";
            }
            console.log("🔀 Redirecting to:", redirectUrl);

            res.redirect(redirectUrl);
          } catch (error) {
            console.error("OAuth Error", error);
            res.status(500).send("Internal Server Error");
          }
        }
      );

      const userId = req.user.id;
      const { currentMonthExists, futureBudget } = await checkUserBudget(
        userId
      );

      let redirectUrl;

      if (currentMonthExists) {
        redirectUrl = process.env.FRONTEND_URL + "/expense-status";
      } else if (futureBudget) {
        redirectUrl = `${process.env.FRONTEND_URL}/expense-status`; // fix
        // expense-status?year=${futureBudget.year}&month=${futureBudget.month}`
      } else {
        redirectUrl = process.env.FRONTEND_URL + "/set-budgets";
      }
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("OAuth Error", error);
      res.status(500).send("Internal Server Error");
    }
  }
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
