const pool = require("../config/db");

async function checkUserBudget(userId) {
  try {
    const currentMonthBudget_q = `
        SELECT target_amount
        FROM budgets
        JOIN dates ON budgets.date_id = dates.id
        WHERE budgets.user_id=?
        AND dates.year = YEAR(CURDATE())
        AND dates.month = MONTH(CURDATE())
        `;

    const [currentBudget] = await pool.execute(currentMonthBudget_q, [userId]);
    const thisMonthBudget = currentBudget.length > 0 ? currentBudget[0] : null;

    const futureBudget_q = `
    SELECT budgets.target_amount, dates.year, dates.month
    FROM budgets
    JOIN dates ON budgets.date_id = dates.id
    WHERE budgets.user_id=?
    AND (dates.year > YEAR(CURDATE())
    OR (dates.year = YEAR(CURDATE()) AND dates.month > MONTH(CURDATE())))
    ORDER BY dates.year ASC, dates.month ASC
    LIMIT 1
    `;

    const [NearestFutureBudget] = await pool.execute(futureBudget_q, [userId]);

    const futureBudget =
      NearestFutureBudget.length > 0 ? NearestFutureBudget[0] : null;

    return { thisMonthBudget, futureBudget };
  } catch (e) {
    console.error("Error checking user budget:", e);
    throw e;
  }
}

module.exports = { checkUserBudget };
