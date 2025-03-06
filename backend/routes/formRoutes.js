const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const { isLoggedIn } = require("../middleware");

router.post("/budgets", isLoggedIn, async (req, res) => {
  const { year, month, target_amount } = req.body;
  const userId = req.user.id;

  try {
    const insertDates_q =
      "INSERT INTO dates (year, month) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)";

    await pool.execute(insertDates_q, [year, month]);

    const getDateId_q = "SELECT id FROM dates WHERE year=? AND month=?";

    const [dateRows] = await pool.execute(getDateId_q, [year, month]);
    const dateId = dateRows[0]?.id;

    if (!dateId) throw new Error("Failed to retrieve date ID");

    const insertBudgets_q =
      "INSERT INTO budgets (user_id, date_id, target_amount) VALUE (?, ?, ?)";
    await pool.execute(insertBudgets_q, [userId, dateId, target_amount]);

    return res
      .status(201)
      .json({ message: "successfully inserted target spending" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

//router.post("/income", async (req, res) => {});
