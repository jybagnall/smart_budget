const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const { isLoggedIn } = require("../middleware");

router.get("", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;

  try {
    const q = "SELECT id, category_name FROM categories WHERE user_id=?";
    const [results] = await pool.execute(q, [user_id]);
    res.json(results);
  } catch (e) {
    console.error("failed to fetch categories", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is empty" });
  }

  try {
    const check_dup_q =
      "SELECT category_name FROM categories WHERE category_name=? AND user_id=?";
    const [existingCategory] = await pool.execute(check_dup_q, [
      category_name,
      user_id,
    ]);

    if (existingCategory.length) {
      return res.status(409).json({ error: `${category_name} already exists` });
    }

    const insert_q =
      "INSERT INTO categories (category_name, user_id) VALUES (?, ?)";
    const [result] = await pool.execute(insert_q, [category_name, user_id]);

    res.status(201).json({ id: result.insertId, category_name });
  } catch (e) {
    console.error("Error updating priority:", e);
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const category_exists_q =
      "SELECT * FROM categories WHERE id=? AND user_id=?";
    const [existingCategory] = await pool.execute(category_exists_q, [
      id,
      user_id,
    ]);

    if (existingCategory.length === 0) {
      return res.status(404).json({ error: "Category does not exist" });
    }

    const delete_q = "DELETE FROM categories WHERE id=? AND user_id=?";
    await pool.execute(delete_q, [id, user_id]);

    res.status(200).json({ message: "Deleted the requested category" });
  } catch (e) {
    console.error("Error deleting the requested category:", e);
    return res.status(500).json({ error: e.message });
  }
});
