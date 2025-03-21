const pool = require("../config/db");

async function checkUserBudget(userId) {
  try {
    const budget_exists_q = `
        SELECT budgets.target_amount
        FROM budgets
        JOIN dates ON budgets.date_id = dates.id
        WHERE dates.user_id = ?
        AND dates.year >= YEAR(CURDATE())
            OR dates.month >= MONTH(CURDATE())
        `;

    const [result] = await pool.execute(budget_exists_q, [userId]);
    const budget_exists = result.length > 0 ? result[0] : null;

    return { budget_exists };
  } catch (e) {
    console.error("Error checking user budget:", e);
    throw e;
  }
}

module.exports = { checkUserBudget };
