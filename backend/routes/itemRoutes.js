const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { isLoggedIn } = require("../middleware");

router.get("", isLoggedIn, async (req, res) => {
  const { dateId } = req.query;

  if (!dateId) {
    return res.status(400).json({ error: "dateId is required" });
  }

  try {
    const q = `
    SELECT * 
    FROM items 
    WHERE date_id=?`;

    const [results] = await pool.execute(q, [dateId]);

    res.json(results);
  } catch (e) {
    console.error("failed to fetch items", e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/expense-status", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;

  try {
    const q = `
      SELECT categories.category_name AS category_name,
      COALESCE(SUM(items.planned_amount), 0) AS sum_per_category
      FROM categories
      LEFT JOIN items ON categories.id = items.category_id
      AND items.user_id=?
      WHERE categories.user_id=?
      GROUP BY categories.id, category_name
    `;

    const [results] = await pool.execute(q, [user_id, user_id]);

    res.json(results);
  } catch (e) {
    console.error("failed to fetch categories", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/:categoryId", isLoggedIn, async (req, res) => {
  const { categoryId } = req.params;
  const { item_name, planned_amount, dateId } = req.body;

  if (
    !categoryId ||
    isNaN(Number(categoryId)) ||
    !item_name ||
    !planned_amount ||
    !dateId
  ) {
    return res.status(400).json({
      error: "Invalid category ID, item field or missing dateId",
    });
  }

  try {
    const insert_q = `
    INSERT INTO items (category_id, item_name, planned_amount, date_id) 
    VALUES (?, ?, ?, ?)`;

    const [result] = await pool.execute(insert_q, [
      categoryId,
      item_name,
      planned_amount,
      dateId,
    ]);

    res.status(201).json({
      id: result.insertId,
      categoryId,
      item_name,
      planned_amount,
      dateId,
    });
  } catch (e) {
    console.error("Error adding item:", e);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.patch("/:categoryId/:itemId", isLoggedIn, async (req, res) => {
  const { categoryId, itemId } = req.params;
  const { item_name, planned_amount, dateId } = req.body;

  if (!categoryId || !itemId || !dateId) {
    return res
      .status(400)
      .json({ error: "Missing category ID, item ID or dateId" });
  }

  try {
    let update_q = `UPDATE items SET `;
    let values = [];

    if (item_name) {
      update_q += `item_name=?, `;
      values.push(item_name);
    }

    if (planned_amount) {
      update_q += `planned_amount=? `;
      values.push(planned_amount);
    }

    update_q = update_q + `WHERE category_id=? AND id=? AND date_id=?`;
    values.push(categoryId, itemId, dateId);

    await pool.execute(update_q, values);

    res.status(200).json({ message: "Item updated successfully" });
  } catch (e) {
    console.error("Error adding item:", e);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.delete("/:itemId", isLoggedIn, async (req, res) => {
  const { itemId } = req.params;
  const { dateId } = req.body;
  const user_id = req.user.id;

  const delete_q = `
    DELETE FROM items 
    WHERE id=?
    AND category_id IN (
      SELECT id FROM categories
      WHERE user_id=? AND date_id=?
    )`;

  try {
    const [result] = await pool.execute(delete_q, [itemId, user_id, dateId]);

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Item not found or unauthorized" });
    }
    res.status(200).json({ message: "Deleted the requested item" });
  } catch (e) {
    console.error("Error deleting the requested item:", e);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
