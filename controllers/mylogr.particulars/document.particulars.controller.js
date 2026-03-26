const POOL = require("../../db/sql/connection");
const { generateShortId } = require("../../utils/commonFunctions");

// Add Particular
exports.addParticular = async (req, res) => {
  const body = req.body;
  body["created_at"] = new Date();
  body["updated_at"] = new Date();

  let shortId;
  let exists = true;

  while (exists) {
    const check = await POOL.query(
      "SELECT 1 FROM document_particulars.records WHERE short_id = $1",
      [shortId],
    );

    console.log("check ", check);
    exists = check.rows.length > 0;
  }
  shortId = generateShortId(body.category);
  console.log("Generated shortId ", shortId);

  body["short_id"] = shortId;
  const keysAllowed = [
    "user_id",
    "category",
    "type",
    "document_particular",
    "status",
    "tenure",
    "renewal_due",
    "frequency",
    "start_date",
    "base_amount",
    "reference_number",
    "validity_from",
    "validity_to",
    "description",
    "created_at",
    "updated_at",
    "total_amount",
    "short_id",
  ];

  try {
    const sqlQuery = `
      INSERT INTO document_particulars.records (${keysAllowed.join(",")})
      VALUES (${keysAllowed.map((_, i) => `$${i + 1}`).join(",")})
    `;

    POOL.query(
      sqlQuery,
      keysAllowed.map((key) => body[key] || null),
      (err, result) => {
        if (err) {
          console.log(err);
          return res.send(err.message);
        }

        res.send({
          status: "success",
          message: "Particular added successfully",
        });
      },
    );
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

exports.updateParticular = (req, res) => {
  const body = req.body;
  const id = req.params.id;

  body["updated_at"] = new Date();

  const keysAllowed = [
    "category",
    "type",
    "document_particular",
    "status",
    "tenure",
    "renewal_due",
    "frequency",
    "start_date",
    "base_amount",
    "reference_number",
    "validity_from",
    "validity_to",
    "description",
    "updated_at",
    "total_amount",
    "short_id",
  ];

  let updateData = {};
  Object.keys(body).forEach((key) => {
    if (keysAllowed.includes(key)) {
      updateData[key] = body[key];
    }
  });

  const fields = Object.keys(updateData);

  if (fields.length === 0) {
    return res.status(400).send({
      status: "error",
      message: "No valid fields to update",
    });
  }

  const setQuery = fields.map((key, i) => `${key}=$${i + 1}`).join(",");

  try {
    POOL.query(
      `UPDATE document_particulars.records 
       SET ${setQuery} 
       WHERE id = '${id}' AND deleted_at IS NULL;`,
      fields.map((key) => updateData[key]),
      (err, result) => {
        if (err) return res.send(err.message);

        res.send({
          status: "success",
          message: "Particular updated successfully",
        });
      },
    );
  } catch (e) {
    res.send(e);
  }
};
exports.deleteParticular = (req, res) => {
  const id = req.params.id;
  const user_id = req.query.user_id;
  console.log("Deleting particular with id ", id, " by user ", user_id);
  try {
    POOL.query(
      `UPDATE document_particulars.records SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL;`,
      [user_id, id],
      (err, result) => {
        if (err) return res.send(err.message);

        res.send({
          status: "success",
          message: "Particular deleted successfully",
        });
      },
    );
  } catch (e) {
    res.send(e);
  }
};
exports.getParticulars = async (req, res) => {
  try {
    const result = await POOL.query(
      `SELECT *
FROM document_particulars.records
WHERE deleted_at IS NULL
ORDER BY created_at DESC;`,
    );

    res.send({
      status: "success",
      data: result.rows,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: "error",
      message: "Internal server error",
    });
  }
};
exports.getParticularById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await POOL.query(
      `SELECT * 
       FROM document_particulars.records 
       WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    res.send({
      status: "success",
      data: result.rows[0],
    });
  } catch (e) {
    res.status(500).send({
      status: "error",
      message: "Error fetching record",
    });
  }
};

exports.restoreParticular = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await POOL.query(
      `UPDATE document_particulars.records
       SET
         deleted_at = NULL,
         deleted_by = NULL,
         updated_at = NOW()
       WHERE id = $1
       RETURNING *;`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Record not found",
      });
    }

    return res.send({
      status: "success",
      message: "Particular restored successfully",
      data: result.rows[0],
    });
  } catch (e) {
    return res.status(500).send({
      status: "error",
      message: "Error restoring record",
    });
  }
};

exports.getDeletedParticulars = async (req, res) => {
  try {
    const result = await POOL.query(
      `SELECT *
       FROM document_particulars.records
       WHERE deleted_at IS NOT NULL
       ORDER BY deleted_at DESC;`,
    );

    return res.send({
      status: "success",
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: "error",
      message: "Error fetching deleted records",
    });
  }
};
