const POOL = require("../../db/sql/connection");

exports.getMonthlyAnalyzer = async (req, res) => {
  const { month } = req.params;
  const userId = req.query.user_id;

  const query = `
     WITH income_data AS (
      SELECT
          (salary + prev_balance + extra_income) AS total_income
      FROM monthly_expenses.incomes
      WHERE user_id = $1
      AND month = DATE_TRUNC('month', $2::date)
      AND is_deleted = FALSE
  ),

  planned_vs_actual AS (
      SELECT
          p.id,
          p.item_name,
          p.estimated_amount,
          COALESCE(SUM(a.amount), 0) AS actual_amount
      FROM monthly_expenses.planned p
      LEFT JOIN monthly_expenses.actual a
          ON p.id = a.planned_id
          AND a.is_deleted = FALSE
      WHERE p.user_id = $1
      AND p.month = DATE_TRUNC('month', $2::date)
      AND p.is_deleted = FALSE
      GROUP BY p.id
  ),

  totals AS (
      SELECT
          (SELECT total_income FROM income_data) AS total_income,
          (SELECT COALESCE(SUM(estimated_amount), 0) FROM planned_vs_actual) AS total_planned,
          (SELECT COALESCE(SUM(actual_amount), 0) FROM planned_vs_actual) +
          (
              SELECT COALESCE(SUM(amount), 0)
              FROM monthly_expenses.actual
              WHERE user_id = $1
              AND month = DATE_TRUNC('month', $2::date)
              AND planned_id IS NULL
              AND is_deleted = FALSE
          ) AS total_actual
  )

  SELECT
      t.total_income,
      t.total_planned,
      t.total_actual,
      (t.total_income - t.total_actual) AS remaining_balance,

      (
          SELECT COALESCE(SUM(amount), 0)
          FROM monthly_expenses.actual
          WHERE user_id = $1
          AND month = DATE_TRUNC('month', $2::date)
          AND planned_id IS NULL
          AND is_deleted = FALSE
      ) AS unplanned_expenses,

      json_agg(
          json_build_object(
              'item_name', p.item_name,
              'estimated', p.estimated_amount,
              'actual', p.actual_amount,
              'variance', (p.estimated_amount - p.actual_amount)
          )
      ) AS breakdown

  FROM totals t, planned_vs_actual p
  GROUP BY t.total_income, t.total_planned, t.total_actual;
    `;

  try {
    const result = await POOL.query(query, [userId, month]);
    res.json({
      status: "success",
      data: result.rows[0] || null,
    });
  } catch (err) {
    console.error("Error in getMonthlyAnalyzer:", err);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch monthly analysis" });
  }
};

exports.getMonthlyAnalyzerSeperate = async (req, res) => {
  const { month } = req.params;
  const userId = req.query.user_id;
  const query = `WITH planned_data AS (
    SELECT 
        p.id,
        p.item_name,
        p.estimated_amount,
        COALESCE(SUM(a.amount), 0) AS actual_amount
    FROM monthly_expenses.planned p
    LEFT JOIN monthly_expenses.actual a
        ON p.id = a.planned_id
        AND a.is_deleted = FALSE
    WHERE p.user_id = $1
    AND p.month = DATE_TRUNC('month', $2::date)
    AND p.is_deleted = FALSE
    GROUP BY p.id
),

extra_expenses AS (
    SELECT COALESCE(SUM(amount), 0) AS extras
    FROM monthly_expenses.actual
    WHERE user_id = $1
    AND month = DATE_TRUNC('month', $2::date)
    AND planned_id IS NULL
    AND is_deleted = FALSE
),

income_data AS (
    SELECT 
        salary,
        prev_balance,
        extra_income,
        (salary + prev_balance + extra_income) AS total_income
    FROM monthly_expenses.incomes
    WHERE user_id = $1
    AND month = DATE_TRUNC('month', $2::date)
    AND is_deleted = FALSE
)

SELECT 
    (SELECT row_to_json(income_data) FROM income_data) AS income,

    (SELECT SUM(estimated_amount) FROM planned_data) AS total_planned,
    (SELECT SUM(actual_amount) FROM planned_data) 
        + (SELECT extras FROM extra_expenses) AS total_actual,

    (SELECT json_agg(
        json_build_object(
            'item_name', item_name,
            'estimated', estimated_amount,
            'actual', actual_amount,
            'variance', (estimated_amount - actual_amount)
        )
    ) FROM planned_data) AS items,

    (SELECT extras FROM extra_expenses) AS extras;`;
  const result = await POOL.query(query, [userId, month]);

  const data = result.rows[0];

  const totalIncome = data.income?.total_income || 0;
  const totalActual = data.total_actual || 0;

  res.json({
    income: data.income,
    summary: {
      total_planned: data.total_planned || 0,
      total_actual: totalActual,
      remaining_balance: totalIncome - totalActual,
    },
    items: data.items || [],
    extras: data.extras || 0,
  });
};
