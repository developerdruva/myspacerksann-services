const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.monthly-spends/income.controller");
const {
  authMiddleware,
  allowRoles,
} = require("../middlewares/authMiddlewares/auth.middleware");

router.use(authMiddleware);

router.post("/", controller.upsertIncome);
router.get("/:month", controller.getIncome);
router.put("/:id", controller.updateIncome);
router.delete("/:id", controller.deleteIncome);

module.exports = router;
