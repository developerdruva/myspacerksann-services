var express = require('express');
var router = express.Router();

var myspacePortfolio = require('../controllers/myspace.portfolio/myspace.portfolio.controller');

router.get('/getmyspacePortfolioDetails', myspacePortfolio?.getMyspacePortfolioDetails);

module.exports = router;