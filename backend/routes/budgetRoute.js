const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const { isLoggedIn } = require("../middleware");

router.get("/target-month", isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    const getTargetMonth_q = `
    SELECT dates.id, dates.year, dates.month
    FROM dates
    LEFT JOIN budgets ON budgets.date_id = dates.id
    WHERE dates.user_id = ?
    ORDER BY dates.id DESC
    LIMIT 1
    `;

    const [row] = await pool.execute(getTargetMonth_q, [userId]);

    if (row.length === 0) {
      return res.status(200).json({ date_id: null, year: null, month: null });
    }

    const data = row[0];
    return res
      .status(200)
      .json({ date_id: data.id, year: data.year, month: data.month });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/set-budgets", isLoggedIn, async (req, res) => {
  const { year, month, target_amount } = req.body;
  const userId = req.user.id;

  try {
    const insertDates_q = `
    INSERT INTO dates (year, month, user_id) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);`; // returns ID
    // update the existing row's id
    await pool.execute(insertDates_q, [year, month, userId]);

    // last inserted or existing date_id
    const [dateRows] = await pool.execute(`SELECT LAST_INSERT_ID() AS id`);
    const dateId = dateRows[0]?.id;

    if (!dateId) throw new Error("Failed to retrieve date ID");

    const insertBudgets_q = `
    INSERT INTO budgets (target_amount, date_id) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE target_amount=VALUES(target_amount)`;

    await pool.execute(insertBudgets_q, [target_amount, dateId]);

    return res
      .status(201)
      .json({ message: "successfully inserted target spending" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
