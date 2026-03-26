const POOL = require("../../db/sql/connection");

// Add Particular
exports.addParticular = async (req, res) => {
  const body = req.body;
  body["created_ip"] = req?.socket?.remoteAddress;
  console.log("body ", body);

  const keysAllowed = [
    "workspace_id",
    "name",
    "amount",
    "type_id",
    "category_id",
    "start_date",
    "due_day",
    "status_id",
    "description",
    "created_by",
  ];

  try {
    // 1️⃣ Insert Particular
    let insertQuery = `
      INSERT INTO particulars_logr.particulars
      (${keysAllowed.join(",")})
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const particularResult = await POOL.query(
      insertQuery,
      keysAllowed.map((key) => body[key]),
    );

    const particular = particularResult.rows[0];

    // 2️⃣ Calculate FIRST next_due_date
    let next_due_date = null;

    const startDate = new Date(body.start_date);

    if (body.type_id === 1) {
      // monthly
      next_due_date = new Date(startDate);

      if (body.due_day) {
        next_due_date.setDate(body.due_day);

        // if already passed → next month
        if (next_due_date < startDate) {
          next_due_date.setMonth(next_due_date.getMonth() + 1);
        }
      }
    } else if (body.type_id === 2) {
      // yearly
      next_due_date = new Date(startDate);
      next_due_date.setFullYear(next_due_date.getFullYear() + 1);
    } else {
      // one-time
      next_due_date = startDate;
    }

    // 3️⃣ Insert Schedule
    const scheduleQuery = `
      INSERT INTO particulars_logr.particular_schedules
      (particular_id, next_due_date, last_paid_date)
      VALUES ($1,$2,NULL)
    `;

    await POOL.query(scheduleQuery, [particular.id, next_due_date]);

    res.send({
      status: "success",
      message: "Particular created with schedule",
      data: particular,
      next_due_date,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({
      status: "error",
      message: "Failed to create particular",
    });
  }
};

// Update Particular
exports.updateParticular = (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const keysAllowed = [
    "name",
    "amount",
    "type_id",
    "category_id",
    "start_date",
    "due_day",
    "status_id",
    "description",
  ];

  let updateData = {};
  let reqKeys = Object.keys(body);

  keysAllowed.forEach((item) => {
    if (reqKeys.includes(item)) {
      updateData[item] = body[item];
    }
  });

  let fields = Object.keys(updateData);

  if (fields.length === 0) {
    return res
      .status(400)
      .send({ status: "error", message: "No valid fields to update." });
  }

  const updateSQLQuery = fields.reduce((prev, curr, index) => {
    return (
      prev +
      `${curr}='${updateData[curr]}'` +
      (index !== fields.length - 1 ? "," : "")
    );
  }, "");

  try {
    let query = `
      UPDATE particulars_logr.particulars 
      SET ${updateSQLQuery}
      WHERE id='${id}'
    `;

    POOL.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err?.message);
      } else {
        res.send({
          status: "success",
          message: "Particular updated successfully.",
        });
      }
    });
  } catch (e) {
    console.log("Error:", e);
    res.send(e);
  }
};

// Delete Particular
exports.deleteParticular = (req, res) => {
  const id = req.params.id;

  try {
    POOL.query(
      `DELETE FROM particulars_logr.particulars WHERE id='${id}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Particular deleted successfully.",
          });
        }
      },
    );
  } catch (e) {
    console.log("Error:", e);
    res.send(e);
  }
};

// Get All Particulars
exports.getParticulars = async (req, res) => {
  try {
    const result = await POOL.query(
      `
      SELECT 
        p.id,
        p.name,
        p.amount,
        c.name AS category,
        s.name AS status,
        ps.next_due_date,
        ps.last_paid_date
      FROM particulars_logr.particulars p
      LEFT JOIN master_data.mst_categories c ON p.category_id = c.id
      LEFT JOIN master_data.mst_status s ON p.status_id = s.id
      LEFT JOIN particulars_logr.particular_schedules ps 
        ON p.id = ps.particular_id
      WHERE p.workspace_id = $1
      ORDER BY ps.next_due_date ASC;  
    `,
      [req.query.workspace_id],
    );

    res.send({
      status: "success",
      data: result.rows || [],
    });
  } catch (e) {
    console.log("Error in getParticulars:", e);
    res.status(500).send({
      status: "error",
      message: "Internal server error",
    });
  }
};
