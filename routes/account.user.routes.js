var express = require('express');
var router = express.Router();

var userAccountController = require('../controllers/user.accounts/registration.controller');

router.post('/chatbotusercreate', userAccountController?.registerUser);
router.post('/chatbotuserlogin', userAccountController?.loginUser);


module.exports = router;
