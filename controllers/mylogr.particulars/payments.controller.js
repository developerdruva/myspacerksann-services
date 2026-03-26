const POOL = require("../../db/sql/connection");

// Mark Payment
exports.markPayment = async (req, res) => {
  const body = req.body;

  const { particular_id, amount, paid_on, status_id, notes } = body;

  try {
    // 1️⃣ Insert payment
    const insertQuery = `
      INSERT INTO particulars_logr.payments
      (particular_id, amount, paid_on, status_id, notes)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;

    const paymentResult = await POOL.query(insertQuery, [
      particular_id,
      amount,
      paid_on,
      status_id || 2, // default = paid
      notes,
    ]);

    // 2️⃣ Get particular details
    const particularQuery = `
      SELECT type_id, due_day
      FROM particulars_logr.particulars
      WHERE id = $1
    `;

    const particularRes = await POOL.query(particularQuery, [particular_id]);

    if (particularRes.rows.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "Particular not found",
      });
    }

    const { type_id, due_day } = particularRes.rows[0];

    // 3️⃣ Calculate next due date
    let next_due_date = new Date(paid_on);

    if (type_id === 1) {
      // monthly
      next_due_date.setMonth(next_due_date.getMonth() + 1);
    } else if (type_id === 2) {
      // yearly
      next_due_date.setFullYear(next_due_date.getFullYear() + 1);
    } else {
      // one-time → no next due
      next_due_date = null;
    }

    // adjust to due_day
    if (next_due_date && due_day) {
      next_due_date.setDate(due_day);
    }

    // 4️⃣ Update schedule
    const updateScheduleQuery = `
      UPDATE particulars_logr.particular_schedules
      SET last_paid_date = $1,
          next_due_date = $2
      WHERE particular_id = $3
    `;

    await POOL.query(updateScheduleQuery, [
      paid_on,
      next_due_date,
      particular_id,
    ]);

    res.send({
      status: "success",
      message: "Payment recorded successfully",
      data: paymentResult.rows[0],
      next_due_date,
    });
  } catch (err) {
    console.log("Error in markPayment:", err);
    res.status(500).send({
      status: "error",
      message: "Internal server error",
    });
  }
};
