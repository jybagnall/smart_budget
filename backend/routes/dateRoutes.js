const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const { isLoggedIn } = require("../middleware");

router.get("/target-month/:dateId", isLoggedIn, async (req, res) => {
  const userId = req.user.id;
  const { dateId } = req.params;

  try {
    const q = `
      SELECT year, month
      FROM dates
      WHERE dates.id = ? AND user_id = ?
      `;

    const [row] = await pool.execute(q, [dateId, userId]);

    if (row.length === 0) {
      return res.status(400).json({ message: "Requested date does not exist" });
    }

    const data = row[0];
    return res.status(200).json({ year: data.year, month: data.month });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/all-dates", isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    const q = `
      SELECT id, year, month
      FROM dates
      WHERE user_id = ?
      ORDER BY year ASC, month ASC
      `;

    const [rows] = await pool.execute(q, [userId]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Dates not found" });
    }

    return res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
