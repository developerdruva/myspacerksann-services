const express = require("express");
const router = express.Router();
const controller = require("../controllers/mylogr.particulars/particulars.controller");

router.post("/", controller.addParticular);
router.put("/:id", controller.updateParticular);
router.delete("/:id", controller.deleteParticular);
router.get("/", controller.getParticulars);

module.exports = router;
