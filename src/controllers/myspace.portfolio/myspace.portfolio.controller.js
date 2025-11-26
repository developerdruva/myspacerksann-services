const POOL = require("../../../configs/db/sql/connection");
const { getClientIp } = require("../../../utils/commonFunctions");
const { getProfileQueries } = require("../../../common/queries/mylogr-sql.js");

exports.getMyspacePortfolioDetails = async (req, res) => {
  try {
    const results = await Promise.all(
      Object.values(getProfileQueries).map((query) => POOL.query(query))
    );
    const data = {};
    Object.keys(getProfileQueries).forEach((key, index) => {
      data[key] = results[index].rows;
    });
    res.set("Cache-Control", "public, max-age=0, s-maxage=0");
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error in getMyspacePortfolioDetails:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

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
