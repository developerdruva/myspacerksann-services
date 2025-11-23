const POOL = require("../../db/sql/connection");
const { getClientIp } = require("../../utils/commonFunctions");
const { successMsgRetrieve } = require("../../utils/commonSyntaxes");
// const { POOL } = require("../../db/dbConfig");

exports.getMyspacePortfolioDetails = async (req, res) => {
  console.log("In getMyspacePortfolioDetails");

  try {
    // All queries are static → safe
    const queries = {
      personDetails: "select * from portfolioblog.person_details",
      summaryEducation: "select * from portfolioblog.summary_education",
      certifications:
        "select * from portfolioblog.certifications order by certify_seq asc",
      pocProjects:
        "select * from portfolioblog.poc_projects order by project_seq asc",
      skillSet: "select * from portfolioblog.skills_set",
      workedCompanies:
        "select * from portfolioblog.worked_companies where is_delete=false order by comp_seq desc",
      workedProjects:
        "select * from portfolioblog.worked_projects order by display_no desc",
      skillsKeys:
        "select * from portfolioblog.skillset_keys order by key_sequence asc",
      mySkills:
        "select * from portfolioblog.skills_list order by skill_seq asc",
      myStudies: "select * from portfolioblog.studies order by study_seq desc",
      usedTechsOfPoc: "select * from portfolioblog.used_techsofpoc",

      // keep this query as-is, it contains no user input
      skillsByCategory: `
        SELECT 
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
        ORDER BY st.id ASC;
      `,

      skillTypes: "select * from master_data.skill_types",
    };

    // Execute all queries parallel
    const results = await Promise.all(
      Object.values(queries).map((q) => POOL.query(q))
    );

    // Map back results to keys
    const data = Object.keys(queries).reduce((acc, key, index) => {
      acc[key] = results[index].rows;
      return acc;
    }, {});

    return res.json({ status: "success", data });
  } catch (error) {
    console.error("Error in getMyspacePortfolioDetails:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// exports.saveFeedbackform = async (webReq, webRes) => {
//   console.log(" console log ", webReq.body);
//   let queryStr = `insert into portfolioblog.feedback_form (likes, dislikes, description) values (${webReq.body.like},${webReq.body.unlike},'${webReq.body.feedbackDesc}')`;
//   console.log(" query ", queryStr);
//   POOL.query(queryStr, (err, result) => {
//     console.log("result", result);
//     console.log("err-", err);
//     if (err) {
//       webRes.send(err?.message);
//     } else {
//       webRes.send({
//         status: "success",
//         message: "feedback registered successfully.",
//       });
//     }
//   });
// };

exports.saveFeedbackform = async (req, res) => {
  const { postId = "default", like, unlike, feedbackDesc } = req.body;
  const ip = getClientIp(req);
  console.log("\n feedback data \n", req.body, ip);

  if (!like && !unlike) {
    return res.status(400).json({ message: "Like or unlike must be true" });
  }

  try {
    const insertQuery = `
      INSERT INTO portfolioblog.feedback_form (post_id, likes, dislikes, description, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await POOL.query(insertQuery, [postId, like, unlike, feedbackDesc, ip]);

    return res.status(201).json({ message: "Feedback saved" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Already liked from this IP" });
    }
    console.error("Error saving feedback", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
