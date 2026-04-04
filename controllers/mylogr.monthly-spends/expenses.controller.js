const POOL = require("../../db/sql/connection");

// CREATE
exports.createExpense = async (req, res) => {
  try {
    const {
      user_id,
      item,
      estimated,
      actual,
      status,
      payment_status,
      expense_date,
      month,
      note,
    } = req.body;

    const result = await POOL.query(
      `INSERT INTO monthly_expenses.expenses
       (user_id, item, estimated, actual, status, payment_status, expense_date, month, note)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        user_id,
        item,
        estimated,
        actual,
        status,
        payment_status,
        expense_date,
        month,
        note,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create expense" });
  }
};

// GET ALL (with filters)
exports.getExpenses = async (req, res) => {
  try {
    const { user_id, month } = req.query;

    let query = `
      SELECT * FROM monthly_expenses.expenses
      WHERE is_deleted = FALSE
    `;
    const values = [];

    if (user_id) {
      values.push(user_id);
      query += ` AND user_id = $${values.length}`;
    }

    if (month) {
      values.push(month);
      query += ` AND month = $${values.length}`;
    }

    query += ` ORDER BY expense_date ASC`;

    const result = await POOL.query(query, values);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// GET BY ID
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await POOL.query(
      `SELECT * FROM monthly_expenses.expenses
       WHERE id = $1 AND is_deleted = FALSE`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};

// UPDATE
exports.updateExpense = async (req, res) => {
  console.log("Updating expense with ID:", req.params.id);
  console.log("Request body:", req.body);
  try {
    const { id } = req.params;

    const {
      item,
      estimated,
      actual,
      status,
      payment_status,
      expense_date,
      month,
      note,
    } = req.body;

    const result = await POOL.query(
      `UPDATE monthly_expenses.expenses
       SET item = $1,
           estimated = $2,
           actual = $3,
           status = $4,
           payment_status = $5,
           expense_date = $6,
           month = $7,
           note = $8
       WHERE id = $9 AND is_deleted = FALSE
       RETURNING *`,
      [
        item,
        estimated,
        actual,
        status,
        payment_status,
        expense_date,
        month,
        note,
        id,
      ],
    );
    console.log("Update result:", result);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ error: "Failed to update expense" });
  }
};

// SOFT DELETE
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleted_by } = req.body;

    const result = await POOL.query(
      `UPDATE monthly_expenses.expenses
       SET is_deleted = TRUE,
           deleted_at = CURRENT_TIMESTAMP,
           deleted_by = $2
       WHERE id = $1 AND is_deleted = FALSE
       RETURNING id`,
      [id, deleted_by],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};

// RESTORE
exports.restoreExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await POOL.query(
      `UPDATE monthly_expenses.expenses
       SET is_deleted = FALSE,
           deleted_at = NULL,
           deleted_by = NULL
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to restore expense" });
  }
};

// MONTHLY SUMMARY
exports.getMonthlySummary = async (req, res) => {
  try {
    const { user_id, month } = req.query;
    console.log("Fetching monthly summary for user:", user_id, "month:", month);
    const result = await POOL.query(
      `SELECT 
    COALESCE(SUM(estimated), 0) AS total_estimated,
    COALESCE(SUM(actual), 0) AS total_actual,

    COALESCE(SUM(CASE 
        WHEN payment_status = TRUE THEN actual 
        ELSE 0 
    END), 0) AS total_paid,

    COALESCE(SUM(CASE 
        WHEN payment_status = FALSE THEN estimated 
        ELSE 0 
    END), 0) AS total_pending,

    -- 🔥 Remaining Expected
    COALESCE(SUM(estimated), 0) -
    COALESCE(SUM(CASE 
        WHEN payment_status = TRUE THEN actual 
        ELSE 0 
    END), 0) AS expected_balance,

    -- 🔥 Remaining Actual
    COALESCE(SUM(actual), 0) -
    COALESCE(SUM(CASE 
        WHEN payment_status = TRUE THEN actual 
        ELSE 0 
    END), 0) AS actual_balance

FROM monthly_expenses.expenses
WHERE user_id = $1
  AND month = $2
  AND is_deleted = FALSE;`,
      [user_id, month],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};
