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

router.get(`/request-budget-month`, isLoggedIn, async (req, res) => {
  const userId = req.user.id;
  const { dateId } = req.query;

  try {
    const getBudgetAndMonth_q = `
    SELECT dates.year, dates.month, budgets.target_amount
    FROM dates
    JOIN budgets ON budgets.date_id = dates.id
    WHERE dates.user_id = ? AND dates.id = ?
    LIMIT 1
    `;

    const [row] = await pool.execute(getBudgetAndMonth_q, [userId, dateId]);
    const data = row[0];

    if (!data) {
      return res.status(404).json({ error: "No budget found for this date" });
    }

    return res.status(200).json({
      target_amount: data.target_amount,
      year: data.year,
      month: data.month,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get(`/calculate-per-category`, isLoggedIn, async (req, res) => {
  const userId = req.user.id;
  const { dateId } = req.query;

  try {
    const q = `
    SELECT
      categories.category_name,
      COALESCE(SUM(items.planned_amount), 0) AS total_per_category
    FROM categories
    LEFT JOIN items
      ON categories.id = items.category_id
      AND categories.date_id = items.date_id
    WHERE categories.user_id = ? AND categories.date_id = ?
    GROUP BY categories.id, categories.category_name
    ;`;

    const [result] = await pool.execute(q, [userId, dateId]);

    return res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get(`/calculate-gross-spending`, isLoggedIn, async (req, res) => {
  const userId = req.user.id;
  const { dateId } = req.query;

  try {
    const q = `
    SELECT
      COALESCE(SUM(items.planned_amount), 0) AS total_spending
    FROM items
    JOIN dates
      ON dates.id = items.date_id
    WHERE dates.user_id = ? AND dates.id = ?
    ;`;

    const [result] = await pool.execute(q, [userId, dateId]);
    const data = result[0];
    return res.status(200).json(data);
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

router.patch("/edit-budgets", isLoggedIn, async (req, res) => {
  const { target_amount, dateId } = req.body;

  try {
    const updateBudget_q = `
    UPDATE budgets
    SET target_amount = ? 
    WHERE date_id = ?;`;

    await pool.execute(updateBudget_q, [target_amount, dateId]);

    return res
      .status(200)
      .json({ message: "successfully updated target spending" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
