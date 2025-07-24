var express = require("express");
var router = express.Router();
var requestIp = require("request-ip");

var myspacePortfolio = require("../controllers/myspace.portfolio/myspace.portfolio.controller");
var myspaceblog = require("../controllers/myspaceblog.mongo/myspaceblog.controller");
// const { getIPmiddleware } = require('../middlewares/profilemiddlewares/requestip.user');
var experienceController = require("../controllers/myspace.portfolio/experience.controller");
var educationController = require("../controllers/myspace.portfolio/education.controller");
const skillsController = require("../controllers/myspace.portfolio/skills.controller");
const certificationsController = require("../controllers/myspace.portfolio/certifications.controller");
const pocprojectsController = require("../controllers/myspace.portfolio/pocprojects.controller");
var getIPmiddleware = (req, res, next) => {
  console.log("hi in middleware ", requestIp?.getClientIp(req));
  if (req?.id) {
    next();
  } else {
    res?.send({
      status: "not access",
      message: "data not found",
    });
  }
};

router.get(
  "/getmyspacePortfolioDetails",
  myspacePortfolio?.getMyspacePortfolioDetails
);
router.get("/getmyspaceblogdetails", myspaceblog?.getPersonalBlogDetails);
// router.post('/saveFeedbackDetails', myspaceblog.saveFeedbackDetails);
router.post("/saveFeedbackDetails", myspacePortfolio.saveFeedbackform);
router.post("/saveWorkedCompanies", experienceController?.saveWorkedCompanies);
router.post("/saveWorkedProject", experienceController.saveWorkedProject);
router.delete(
  "/deleteRecordOnWorkedCompanies/:id",
  experienceController?.deleteCompRecord
);
router.put(
  "/updateWorkCompanyRecord/:id",
  experienceController?.updateWorkCompanyRecord
);
router.put(
  "/updateWorkedProject/:id",
  experienceController.updateWorkedProject
);
router.get("/getExperienceDetails", experienceController.getExperienceDetails);
router.post("/addEducationDetail", educationController.addEducationDetail);
router.put(
  "/updateEducationDetail/:id",
  educationController.updateEducationDetail
);
router.delete(
  "/deleteEducationDetail/:id",
  educationController.deleteEducationDetail
);
router.get("/getEducationDetails", educationController.getEducationDetails);
router.post("/addSkillDetail", skillsController.addSkillDetail);
router.put("/updateSkillDetail/:id", skillsController.updateSkillDetail);
router.delete("/deleteSkillDetail/:id", skillsController.deleteSkillDetail);
router.get("/getSkillDetails", skillsController.getSkillDetails);
router.get("/getSkillsByCategory", skillsController.getSkillsByCategory);
router.post("/addSkillsListDetail", skillsController.addSkillsListDetail);
router.put(
  "/updateSkillsListDetail/:id",
  skillsController.updateSkillsListDetail
);
router.delete(
  "/deleteSkillsListDetail/:id",
  skillsController.deleteSkillsListDetail
);
router.get("/getSkillsListDetails", skillsController.getSkillsListDetails);
router.post("/addCertification", certificationsController.addCertification);
router.put(
  "/updateCertification/:id",
  certificationsController.updateCertification
);
router.delete(
  "/deleteCertification/:id",
  certificationsController.deleteCertification
);
router.get("/getCertifications", certificationsController.getCertifications);
router.post("/addPocProject", pocprojectsController.addPocProject);
router.put("/updatePocProject/:id", pocprojectsController.updatePocProject);
router.delete("/deletePocProject/:id", pocprojectsController.deletePocProject);
router.get("/getPocProjects", pocprojectsController.getPocProjects);

module.exports = router;
