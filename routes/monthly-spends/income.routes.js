const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.monthly-spends/income.controller");

router.post("/", controller.upsertIncome);
router.get("/:month", controller.getIncome);
router.put("/:id", controller.updateIncome);
router.delete("/:id", controller.deleteIncome);

module.exports = router;
