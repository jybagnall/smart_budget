const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { isLoggedIn } = require("../middleware");

router.get("", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { category_id } = req.query;

  if (!category_id) {
    return res.status(400).json({ error: "Category ID is required" });
  }
  try {
    const q = `
    SELECT id, item_name, planned_amount 
    FROM items 
    WHERE user_id=? AND category_id=?`;

    const [results] = await pool.execute(q, [user_id, category_id]);

    res.json(results);
  } catch (e) {
    console.error("failed to fetch categories", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { category_id, item_name, planned_amount } = req.body;

  if (!category_id || !item_name || !planned_amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const insert_q = `INSERT INTO items (category_id, user_id, item_name, planned_amount) VALUES (?, ?, ?, ?)`;

    const [result] = await pool.execute(insert_q, [
      category_id,
      user_id,
      item_name,
      planned_amount,
    ]);

    res.status(201).json({
      id: result.insertId,
      category_id,
      user_id,
      item_name,
      planned_amount,
    });
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
    SELECT * FROM items WHERE id=? AND category_id=? AND user_id=? `;
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
