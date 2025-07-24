const POOL = require("../../db/sql/connection");

// Add POC project
exports.addPocProject = (req, res) => {
  const body = req.body;
  body["created_ip"] = req?.socket?.remoteAddress;
  const keysAllowed = [
    "title",
    "project_url",
    "project_type",
    "title_subdesc",
    "project_desc",
    "email_id",
    "created_ip",
    "img_url",
    "project_seq",
  ];
  try {
    let sqlQuery = `INSERT INTO portfolioblog.poc_projects (${keysAllowed.join(
      ","
    )}) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
    POOL.query(
      sqlQuery,
      keysAllowed.map((key) => body[key]),
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "POC project added successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Update POC project
exports.updatePocProject = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const keysAllowed = [
    "title",
    "project_url",
    "project_type",
    "title_subdesc",
    "project_desc",
    "email_id",
    "img_url",
    "project_seq",
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
    let updateQuery = `UPDATE portfolioblog.poc_projects SET ${updateSQLQuery} WHERE sl_no=${id}`;
    POOL.query(updateQuery, (err, result) => {
      if (err) {
        res.send(err?.message);
      } else {
        res.send({
          status: "success",
          message: "POC project updated successfully.",
        });
      }
    });
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Delete POC project
exports.deletePocProject = (req, res) => {
  const id = req.params.id;
  try {
    POOL.query(
      `DELETE FROM portfolioblog.poc_projects WHERE sl_no = ${id}`,
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "POC project deleted successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Get all POC projects
exports.getPocProjects = async (req, res) => {
  try {
    const result = await POOL.query(
      "SELECT * FROM portfolioblog.poc_projects ORDER BY project_seq ASC"
    );
    res.send({ status: "success", pocProjects: result?.rows || [] });
  } catch (e) {
    console.log("Error in getPocProjects:", e);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};
