const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.particulars/dashboard.controller");
const {
  authMiddleware,
} = require("../middlewares/authMiddlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", controller.getDashboard);

module.exports = router;
