const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.particulars/payments.controller");
const {
  authMiddleware,
} = require("../middlewares/authMiddlewares/auth.middleware");

router.use(authMiddleware);

router.post("/mark", controller.markPayment);

module.exports = router;
