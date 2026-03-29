var express = require("express");
var router = express.Router();
const {
  authMiddleware,
} = require("./middlewares/authMiddlewares/auth.middleware");

var sampledataController = require("../controllers/samples/sampledata.controller");

router.get("/getSampleRecord", sampledataController.getSampleRecord);
router.get("/dbrequestAllEmp", sampledataController.getEmployees);
router.get("/dbrequestEmpby/:id", sampledataController.getEmployeeById);
router.post("/createUser", sampledataController.insertEmployee);
router.get(
  "/getSampleRecord",
  authMiddleware,
  sampledataController.getSampleRecord,
);
router.get(
  "/dbrequestAllEmp",
  authMiddleware,
  sampledataController.getEmployees,
);
router.get(
  "/dbrequestEmpby/:id",
  authMiddleware,
  sampledataController.getEmployeeById,
);
router.post("/createUser", authMiddleware, sampledataController.insertEmployee);

module.exports = router;
