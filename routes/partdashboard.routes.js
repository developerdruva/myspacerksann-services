const express = require("express");
const router = express.Router();
const controller = require("../controllers/mylogr.particulars/dashboard.controller");

router.get("/", controller.getDashboard);

module.exports = router;
