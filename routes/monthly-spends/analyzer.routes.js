const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.monthly-spends/analyzer.controller");

router.get("/:month", controller.getMonthlyAnalyzer);
router.get("/seperate/:month", controller.getMonthlyAnalyzerSeperate);

module.exports = router;
