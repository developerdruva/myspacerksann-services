const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.particulars/payments.controller");

router.post("/mark", controller.markPayment);

module.exports = router;
