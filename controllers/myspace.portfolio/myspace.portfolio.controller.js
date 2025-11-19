const POOL = require("../../db/sql/connection");
const { getClientIp } = require("../../utils/commonFunctions");
const { successMsgRetrieve } = require("../../utils/commonSyntaxes");

exports.getMyspacePortfolioDetails = async (webReq, webRes) => {
  console.log(" hi in get myspace -----");
  console.log(" hi in get myspace ----- new line for test ");
  console.log(" hi in get myspace ----- new line for test 11");
  console.log(" hi in get myspace ----- new line welcome 123");
  console.log(" hi in get myspace ----- new line welcome 0000");

  try {
    var personDetails = await POOL?.query(
      "select * from portfolioblog.person_details"
    );
    var summaryEducation = await POOL?.query(
      "select * from portfolioblog.summary_education"
    );
    var certifications = await POOL?.query(
      "select * from portfolioblog.certifications order by certify_seq asc"
    );
    var pocProjects = await POOL?.query(
      "select * from portfolioblog.poc_projects order by project_seq asc"
    );
    var skillSet = await POOL?.query("select * from portfolioblog.skills_set");
    var workedCompanies = await POOL?.query(
      "select * from portfolioblog.worked_companies where is_delete=false order by comp_seq desc"
    );
    var workedProjects = await POOL?.query(
      "select * from portfolioblog.worked_projects  order by display_no desc"
    );
    var skillsKeys = await POOL?.query(
      "select * from portfolioblog.skillset_keys order by key_sequence asc"
    );
    var mySkills = await POOL?.query(
      "select * from portfolioblog.skills_list order by skill_seq asc"
    );
    var studies = await POOL?.query(
      "select * from portfolioblog.studies order by study_seq desc"
    );
    var usedTechsOfPoc = await POOL?.query(
      "select * from portfolioblog.used_techsofpoc"
    );
    const skillsByCategory = await POOL.query(
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

    const skillTypes = await POOL.query(
      `select * from master_data.skill_types`
    );

    // console.log("persondetails ", personDetails?.rows);
    if (personDetails?.rowCount > 0) {
      successMsgRetrieve["data"] = {
        personDetails: personDetails?.rows,
        summaryEducation: summaryEducation?.rows,
        certifications: certifications?.rows,
        pocProjects: pocProjects?.rows,
        skillSet: skillSet?.rows,
        workedCompanies: workedCompanies?.rows,
        workedProjects: workedProjects?.rows,
        skillsKeys: skillsKeys?.rows,
        mySkills: mySkills?.rows,
        myStudies: studies?.rows,
        usedTechsOfPoc: usedTechsOfPoc?.rows,
        skillsByCategory: skillsByCategory?.rows || [],
        skillTypes: skillTypes?.rows || [],
      };
      webRes?.send(successMsgRetrieve);
    }
  } catch (e) {
    console.log("catch ", e);
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
