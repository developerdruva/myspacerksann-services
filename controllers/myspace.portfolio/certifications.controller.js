const POOL = require("../../db/sql/connection");

// Add certification
exports.addCertification = (req, res) => {
  const body = req.body;
  body["created_ip"] = req?.socket?.remoteAddress;
  const keysAllowed = [
    "certify_name",
    "certify_url",
    "certify_type",
    "institute",
    "email_id",
    "created_ip",
    "certify_seq",
  ];
  try {
    let sqlQuery = `INSERT INTO portfolioblog.certifications (${keysAllowed.join(
      ","
    )}) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    POOL.query(
      sqlQuery,
      keysAllowed.map((key) => body[key]),
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Certification added successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Update certification
exports.updateCertification = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const keysAllowed = [
    "certify_name",
    "certify_url",
    "certify_type",
    "institute",
    "email_id",
    "certify_seq",
  ];
  let updateData = {};
  let reqKeys = Object.keys(body);
  keysAllowed.forEach((item) => {
    if (reqKeys.includes(item)) {
      updateData[item] = body[item];
    }
  });
  let x = Object.keys(updateData);
  if (x.length === 0) {
    return res
      .status(400)
      .send({ status: "error", message: "No valid fields to update." });
  }
  const updateSQLQuery = x.reduce((preVal, currVal, index) => {
    return (
      preVal +
      `${currVal}='${updateData[currVal]}'` +
      (index != x.length - 1 ? "," : "")
    );
  }, "");
  try {
    let updateQuery = `UPDATE portfolioblog.certifications SET ${updateSQLQuery} WHERE sl_no=${id}`;
    POOL.query(updateQuery, (err, result) => {
      if (err) {
        res.send(err?.message);
      } else {
        res.send({
          status: "success",
          message: "Certification updated successfully.",
        });
      }
    });
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Delete certification
exports.deleteCertification = (req, res) => {
  const id = req.params.id;
  try {
    POOL.query(
      `DELETE FROM portfolioblog.certifications WHERE sl_no = ${id}`,
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Certification deleted successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Get all certifications
exports.getCertifications = async (req, res) => {
  try {
    const result = await POOL.query(
      "SELECT * FROM portfolioblog.certifications ORDER BY certify_seq ASC"
    );
    res.send({ status: "success", certifications: result?.rows || [] });
  } catch (e) {
    console.log("Error in getCertifications:", e);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};
