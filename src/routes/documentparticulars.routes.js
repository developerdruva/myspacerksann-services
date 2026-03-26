const express = require("express");
const router = express.Router();
const controller = require("../controllers/mylogr.particulars/document.particulars.controller");

router.post("/create-record", controller.addParticular);
router.put("/update-record/:id", controller.updateParticular);
router.delete("/delete/:id", controller.deleteParticular);
router.put("/restore/:id", controller.restoreParticular);
router.get("/", controller.getParticulars);
router.get("/deleted", controller.getDeletedParticulars);
router.get("/:id", controller.getParticularById);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/mylogr.particulars/document.particulars.controller");

router.post("/create-record", controller.addParticular);
router.put("/update-record/:id", controller.updateParticular);
router.delete("/delete/:id", controller.deleteParticular);
router.put("/restore/:id", allowRoles("admin"), controller.restoreParticular);
router.get("/", controller.getParticulars);
router.get("/deleted", controller.getDeletedParticulars);
router.get("/:id", controller.getParticularById);

module.exports = router;
