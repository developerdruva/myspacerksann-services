var express = require('express');
var router = express.Router();

var sampledataController = require('../controllers/samples/sampledata.controller');

router.get('/dbrequestAllEmp', sampledataController.getEmployees);
router.get('/dbrequestEmpby/:id', sampledataController.getEmployeeById);
router.post('/createUser', sampledataController.insertEmployee);

module.exports = router;

