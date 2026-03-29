const express = require("express");
const router = express.Router();
const controller = require("../../controllers/user.accounts/auth.controller");
const { validateBody } = require("../middlewares/validation.middleware");
const {
  registerSchema,
  loginSchema,
  ssoTokenSchema,
} = require("../middlewares/schemas/auth.schemas");

router.post("/sso-token", validateBody(ssoTokenSchema), controller.ssoToken);
router.post("/register", validateBody(registerSchema), controller.register);
router.post("/login", validateBody(loginSchema), controller.login);
router.get("/me", controller.me);

module.exports = router;
