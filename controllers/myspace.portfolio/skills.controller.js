const POOL = require("../../db/sql/connection");

// Add skill detail
exports.addSkillDetail = (req, res) => {
  const body = req.body;
  body["created_ip"] = req?.socket?.remoteAddress;
  const keysAllowed = ["email_id", "skill_type_id", "skill_name", "created_ip"];
  try {
    let sqlQuery = `INSERT INTO portfolioblog.myskills (${keysAllowed.join(
      ","
    )}) VALUES ($1,$2,$3,$4)`;
    POOL.query(
      sqlQuery,
      keysAllowed.map((key) => body[key]),
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Skill detail added successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Update skill detail
exports.updateSkillDetail = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const keysAllowed = ["email_id", "skill_type_id", "skill_name"];
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
    let updateQuery = `UPDATE portfolioblog.myskills SET ${updateSQLQuery} WHERE sl_no=${id}`;
    POOL.query(updateQuery, (err, result) => {
      if (err) {
        res.send(err?.message);
      } else {
        res.send({
          status: "success",
          message: "Skill detail updated successfully.",
        });
      }
    });
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Delete skill detail
exports.deleteSkillDetail = (req, res) => {
  const id = req.params.id;
  try {
    POOL.query(
      `DELETE FROM portfolioblog.myskills WHERE sl_no = ${id}`,
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Skill detail deleted successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Get all skill details
exports.getSkillDetails = async (req, res) => {
  try {
    const result = await POOL.query(
      "SELECT * FROM portfolioblog.myskills ORDER BY sl_no ASC"
    );
    res.send({ status: "success", skills: result?.rows || [] });
  } catch (e) {
    console.log("Error in getSkillDetails:", e);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

// Fetch skills grouped by category
exports.getSkillsByCategory = async (req, res) => {
  try {
    // Assuming skill_type_id is the category, and you want skills grouped by it
    const result = await POOL.query(
      `SELECT 
  st.id as skill_type_id, 
  st.label_name AS skill_type_name, 
  array_agg(
    json_build_object(
      'sl_no', ms.sl_no,
      'skill_name', ms.skill_name
    )
  ) AS skills
FROM portfolioblog.myskills ms
JOIN master_data.skill_types st ON st.id = ms.skill_type_id
GROUP BY st.id, st.label_name
ORDER BY st.id ASC;`
    );
    res.send({ status: "success", skillsByCategory: result?.rows || [] });
  } catch (e) {
    console.log("Error in getSkillsByCategory:", e);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

// Add skill to skills_list
exports.addSkillsListDetail = (req, res) => {
  const body = req.body;
  body["created_ip"] = req?.socket?.remoteAddress;
  const keysAllowed = [
    "skill_name",
    "skill_value",
    "skill_seq",
    "skill_style",
    "created_ip",
  ];
  try {
    let sqlQuery = `INSERT INTO portfolioblog.skills_list (${keysAllowed.join(
      ","
    )}) VALUES ($1,$2,$3,$4,$5)`;
    POOL.query(
      sqlQuery,
      keysAllowed.map((key) => body[key]),
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Skill list detail added successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Update skill in skills_list
exports.updateSkillsListDetail = (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const keysAllowed = ["skill_name", "skill_value", "skill_seq", "skill_style"];
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
    let updateQuery = `UPDATE portfolioblog.skills_list SET ${updateSQLQuery} WHERE sl_no=${id}`;
    POOL.query(updateQuery, (err, result) => {
      if (err) {
        res.send(err?.message);
      } else {
        res.send({
          status: "success",
          message: "Skill list detail updated successfully.",
        });
      }
    });
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Delete skill from skills_list
exports.deleteSkillsListDetail = (req, res) => {
  const id = req.params.id;
  try {
    POOL.query(
      `DELETE FROM portfolioblog.skills_list WHERE sl_no = ${id}`,
      (err, result) => {
        if (err) {
          res.send(err?.message);
        } else {
          res.send({
            status: "success",
            message: "Skill list detail deleted successfully.",
          });
        }
      }
    );
  } catch (e) {
    res.send(e);
    console.log("e ", e);
  }
};

// Get all skills_list details
exports.getSkillsListDetails = async (req, res) => {
  try {
    const result = await POOL.query(
      "SELECT * FROM portfolioblog.skills_list ORDER BY skill_seq ASC"
    );
    res.send({ status: "success", skillsList: result?.rows || [] });
  } catch (e) {
    console.log("Error in getSkillsListDetails:", e);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};
