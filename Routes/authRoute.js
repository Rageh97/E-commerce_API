const express = require("express");

const router = express.Router();

const { signup,login, forgotPassword } = require("../services/authService");
const { signupValidator,loginValidator } = require("../utils/validators/authValidator");

router.post("/signup",signupValidator, signup);
router.post("/login",loginValidator, login);
router.post("/forgotPassword", forgotPassword);


module.exports = router;
