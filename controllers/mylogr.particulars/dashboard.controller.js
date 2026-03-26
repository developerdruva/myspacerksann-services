const POOL = require("../../db/sql/connection");

// Dashboard Summary
exports.getDashboard = async (req, res) => {
  try {
    const workspace_id = req.query.workspace_id;

    if (!workspace_id) {
      return res.status(400).send({
        status: "error",
        message: "workspace_id is required",
      });
    }

    // 1️⃣ Upcoming dues (next 7 days)
    const upcomingQuery = `
      SELECT p.name, ps.next_due_date, p.amount
      FROM particulars_logr.particulars p
      JOIN particulars_logr.particular_schedules ps 
        ON p.id = ps.particular_id
      WHERE p.workspace_id = $1
        AND ps.next_due_date BETWEEN CURRENT_DATE 
        AND CURRENT_DATE + INTERVAL '7 days'
      ORDER BY ps.next_due_date ASC
    `;

    const upcoming = await POOL.query(upcomingQuery, [workspace_id]);

    // 2️⃣ Overdue
    const overdueQuery = `
      SELECT p.name, ps.next_due_date, p.amount
      FROM particulars_logr.particulars p
      JOIN particulars_logr.particular_schedules ps 
        ON p.id = ps.particular_id
      WHERE p.workspace_id = $1
        AND ps.next_due_date < CURRENT_DATE
      ORDER BY ps.next_due_date ASC
    `;

    const overdue = await POOL.query(overdueQuery, [workspace_id]);

    // 3️⃣ Monthly total
    const monthlyQuery = `
      SELECT COALESCE(SUM(p.amount),0) as total
      FROM particulars_logr.particulars p
      JOIN particulars_logr.particular_schedules ps 
        ON p.id = ps.particular_id
      WHERE p.workspace_id = $1
        AND DATE_TRUNC('month', ps.next_due_date) = DATE_TRUNC('month', CURRENT_DATE)
    `;

    const monthly = await POOL.query(monthlyQuery, [workspace_id]);

    // 4️⃣ Total active
    const activeQuery = `
      SELECT COUNT(*) as total
      FROM particulars_logr.particulars
      WHERE workspace_id = $1
        AND status_id = 1
    `;

    const active = await POOL.query(activeQuery, [workspace_id]);

    // 5️⃣ Paid this month
    const paidQuery = `
      SELECT COALESCE(SUM(amount),0) as total
      FROM particulars_logr.payments
      WHERE DATE_TRUNC('month', paid_on) = DATE_TRUNC('month', CURRENT_DATE)
    `;

    const paid = await POOL.query(paidQuery);

    res.send({
      status: "success",
      data: {
        upcoming: upcoming.rows,
        overdue: overdue.rows,
        monthly_total: monthly.rows[0].total,
        active_count: active.rows[0].total,
        paid_this_month: paid.rows[0].total,
      },
    });
  } catch (err) {
    console.log("Dashboard Error:", err);
    res.status(500).send({
      status: "error",
      message: "Failed to load dashboard",
    });
  }
};
