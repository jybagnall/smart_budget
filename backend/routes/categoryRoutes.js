const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { isLoggedIn } = require("../middleware");

router.get("", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { dateId } = req.query;

  if (!dateId) {
    return res.status(400).json({ error: "dateId is required" });
  }

  try {
    const q = `
    SELECT id, category_name 
    FROM categories 
    WHERE user_id=? AND date_id=?`;

    const [results] = await pool.execute(q, [user_id, dateId]);
    res.json(results);
  } catch (e) {
    console.error("failed to fetch categories", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { category_name, dateId } = req.body;

  if (!category_name || !dateId) {
    return res
      .status(400)
      .json({ error: "Either category name or dateId is missing" });
  }

  try {
    const check_dup_q = `
    SELECT category_name 
    FROM categories 
    WHERE category_name=? AND user_id=? AND date_id = ?`;

    const [existingCategory] = await pool.execute(check_dup_q, [
      category_name,
      user_id,
      dateId,
    ]);

    if (existingCategory.length) {
      return res.status(409).json({ error: `${category_name} already exists` });
    }

    const insert_q = `
    INSERT INTO categories (category_name, user_id, date_id) 
    VALUES (?, ?, ?)`;

    const [result] = await pool.execute(insert_q, [
      category_name,
      user_id,
      dateId,
    ]);

    res
      .status(201)
      .json({ id: result.insertId, category_name, user_id, dateId });
  } catch (e) {
    console.error("Error updating category:", e);
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/:categoryId", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { categoryId } = req.params;

  try {
    const delete_q = `
    DELETE FROM categories 
    WHERE id=? AND user_id=?`;

    const [result] = await pool.execute(delete_q, [categoryId, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Requested category not found" });
    }

    res.status(200).json({ message: "Category successfully deleted" });
  } catch (e) {
    console.error("Error deleting the requested category:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
