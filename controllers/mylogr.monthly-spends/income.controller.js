const POOL = require("../../db/sql/connection");

exports.upsertIncome = async (req, res) => {
  const { month, salary, prev_balance, extra_income } = req.body;
  const userId = req.params.user_id || req.query.user_id;

  const query = `
    INSERT INTO monthly_expenses.incomes (
      user_id, month, salary, prev_balance, extra_income
    )
    VALUES ($1, DATE_TRUNC('month', $2::date), $3, $4, $5)
    ON CONFLICT (user_id, month)
    DO UPDATE SET
      salary = EXCLUDED.salary,
      prev_balance = EXCLUDED.prev_balance,
      extra_income = EXCLUDED.extra_income,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const result = await POOL.query(query, [
    userId,
    month,
    salary,
    prev_balance,
    extra_income,
  ]);

  res.json(result.rows[0]);
};

exports.getIncome = async (req, res) => {
  console.log(" params ", req.params);
  const { month } = req.params;
  const userId = req.params.user_id || req.query.user_id;
  console.log("Getting income for user:", userId, "month:", month);

  const query = `
    SELECT *
    FROM monthly_expenses.incomes
    WHERE user_id = $1
    AND month = DATE_TRUNC('month', $2::date)
    AND is_deleted = FALSE;
  `;

  const result = await POOL.query(query, [userId, month]);

  res.json(result.rows[0] || null);
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const { salary, prev_balance, extra_income } = req.body;

  const query = `
    UPDATE monthly_expenses.incomes
    SET
      salary = $2,
      prev_balance = $3,
      extra_income = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    AND is_deleted = FALSE
    RETURNING *;
  `;

  const result = await POOL.query(query, [
    id,
    salary,
    prev_balance,
    extra_income,
  ]);

  res.json(result.rows[0]);
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE monthly_expenses.incomes
    SET
      is_deleted = TRUE,
      deleted_at = CURRENT_TIMESTAMP,
      deleted_by = $2 
    WHERE id = $1;
  `;

  await POOL.query(query, [id, req.user.email]);

  res.json({ message: "Income deleted" });
};
