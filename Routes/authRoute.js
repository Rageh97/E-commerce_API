const express = require("express");

const router = express.Router();

const { signup } = require("../services/authService");
const { signupValidator } = require("../utils/validators/signupValidator");

router
  .route("/")

  .post(signupValidator, signup);

module.exports = router;
