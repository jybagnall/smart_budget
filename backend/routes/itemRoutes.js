const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { isLoggedIn } = require("../middleware");

router.get("", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;

  try {
    const q = `
    SELECT * 
    FROM items 
    WHERE user_id=?`;

    const [results] = await pool.execute(q, [user_id]);

    res.json(results);
  } catch (e) {
    console.error("failed to fetch categories", e);
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
// '/:item_name' or '/item_name'
router.post("/:categoryId", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { categoryId } = req.params;
  const { item_name, planned_amount } = req.body;

  if (!categoryId || categoryId === "null" || !item_name || !planned_amount) {
    return res
      .status(400)
      .json({ error: "Invalid category ID or item field is missing" });
  }

  try {
    const insert_q = `
    INSERT INTO items (category_id, user_id, item_name, planned_amount) 
    VALUES (?, ?, ?, ?)`;

    const [result] = await pool.execute(insert_q, [
      categoryId,
      user_id,
      item_name,
      planned_amount,
    ]);

    res.status(201).json({
      id: result.insertId,
      categoryId,
      user_id,
      item_name,
      planned_amount,
    });
  } catch (e) {
    console.error("Error adding item:", e);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.patch("/:categoryId/:itemId", isLoggedIn, async (req, res) => {
  const { categoryId, itemId } = req.params;
  const { item_name, planned_amount } = req.body;

  if (!categoryId || !itemId) {
    return res.status(400).json({ error: "Invalid category ID or item ID" });
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

    update_q = update_q + `WHERE category_id=? AND id=?`;
    values.push(categoryId, itemId);

    await pool.execute(update_q, values);

    res.status(200).json({ message: "Item updated successfully" });
  } catch (e) {
    console.error("Error adding item:", e);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.delete("/:categoryId/:itemId", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { categoryId, itemId } = req.params;

  try {
    const item_exists_q = `
    SELECT * FROM items WHERE id=? AND category_id=? AND user_id=?`;
    const [existingItem] = await pool.execute(item_exists_q, [
      itemId,
      categoryId,
      user_id,
    ]);

    if (existingItem.length === 0) {
      return res.status(404).json({ error: "Item does not exist" });
    }

    const delete_q = `
    DELETE FROM items WHERE id=? AND category_id=? AND user_id=?`;

    await pool.execute(delete_q, [itemId, categoryId, user_id]);

    res.status(200).json({ message: "Deleted the requested item" });
  } catch (e) {
    console.error("Error deleting the requested item:", e);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
