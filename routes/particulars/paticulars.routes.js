const express = require("express");
const router = express.Router();
const controller = require("../../controllers/mylogr.particulars/particulars.controller");
const {
  authMiddleware,
} = require("../middlewares/authMiddlewares/auth.middleware");

router.use(authMiddleware);

router.post("/", controller.addParticular);
router.put("/:id", controller.updateParticular);
router.delete("/:id", controller.deleteParticular);
router.get("/", controller.getParticulars);

module.exports = router;
