const express = require("express");
const router = express.Router();
const controller = require("../../controllers/user.accounts/auth.controller");

router.post("/sso-token", controller.ssoToken);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", controller.me);

module.exports = router;
