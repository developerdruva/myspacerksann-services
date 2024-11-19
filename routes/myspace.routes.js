var express = require('express');
var router = express.Router();
var requestIp = require('request-ip');

var myspacePortfolio = require('../controllers/myspace.portfolio/myspace.portfolio.controller');
var myspaceblog = require('../controllers/myspaceblog.mongo/myspaceblog.controller')
// const { getIPmiddleware } = require('../middlewares/profilemiddlewares/requestip.user');

var getIPmiddleware = (req, res, next) => {
    console.log('hi in middleware ', requestIp?.getClientIp(req));
    if (req?.id) {
        next()
    } else {
        res?.send({
            status: 'not access',
            message: 'data not found'
        })
    }
}

router.get('/getmyspacePortfolioDetails', myspacePortfolio?.getMyspacePortfolioDetails);
router.get('/getmyspaceblogdetails', myspaceblog?.getPersonalBlogDetails);
// router.post('/saveFeedbackDetails', myspaceblog.saveFeedbackDetails);
router.post('/saveFeedbackDetails', myspacePortfolio.saveFeedbackform);


module.exports = router;