const pool = require("../config/db");

async function checkInitialBudget(userId) {
    const q = `
        SELECT budgets.target_amount, dates.id AS date_id, dates.year, dates.month
        FROM budgets
        JOIN dates ON budgets.date_id = dates.id
        WHERE dates.user_id = ?
         AND (
          (dates.year = YEAR(CURDATE()) AND dates.month = MONTH(CURDATE()))
           OR (dates.year > YEAR(CURDATE()) 
            OR (dates.year = YEAR(CURDATE()) AND dates.month > MONTH(CURDATE()))
            )
          )
        ORDER BY dates.year ASC, dates.month ASC
        LIMIT 1`;
  
    const [rows] = await pool.execute(q, [userId]);

    return rows[0] || null
}
 
module.exports = {checkInitialBudget};