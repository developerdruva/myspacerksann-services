const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.monthly-spends/analyzer.controller");
const { authMiddleware } = require("../middlewares/authMiddlewares/auth.middleware");

router.use(authMiddleware);

router.get("/:month", controller.getMonthlyAnalyzer);
router.get("/seperate/:month", controller.getMonthlyAnalyzerSeperate);

module.exports = router;
