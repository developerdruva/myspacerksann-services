const POOL = require("../../db/sql/connection");

// Add education details
exports.addEducationDetail = (req, res) => {
  const body = req.body;
  body["created_ip"] = req?.socket?.remoteAddress;
  const keysAllowed = [
    "study",
    "study_intitute",
    "study_seq",
    "pass_percent",
    "study_desc",
    "stream",
    "university",
    "study_location",
    "created_ip",
  ];
  try {
    let sqlQuery = `INSERT INTO portfolioblog.studies (${keysAllowed.join(
      ","
    )}) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
    POOL.query(
      sqlQuery,
      keysAllowed.map((key) => body[key]),
      (err, result) => {
        // console.log("result in education update", result);
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Education detail added successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Update education details
exports.updateEducationDetail = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const keysAllowed = [
    "study",
    "study_intitute",
    "study_seq",
    "pass_percent",
    "study_desc",
    "stream",
    "university",
    "study_location",
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
    let updateQuery = `UPDATE portfolioblog.studies SET ${updateSQLQuery} WHERE sl_no=${id}`;
    // console.log("result in education query", updateQuery);

    POOL.query(updateQuery, (err, result) => {
      // console.log("result in education update", result);

      if (err) {
        res.send(err?.message);
      } else {
        res.send({
          status: "success",
          message: "Education detail updated successfully.",
        });
      }
    });
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Delete education detail
exports.deleteEducationDetail = (req, res) => {
  const id = req.params.id;
  try {
    POOL.query(
      `DELETE FROM portfolioblog.studies WHERE sl_no = ${id}`,
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Education detail deleted successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Get all education details
exports.getEducationDetails = async (req, res) => {
  try {
    const result = await POOL.query(
      "SELECT * FROM portfolioblog.studies ORDER BY study_seq ASC"
    );
    res.send({ status: "success", education: result?.rows || [] });
  } catch (e) {
    console.log("Error in getEducationDetails:", e);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};
