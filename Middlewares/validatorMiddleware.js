const { validationResult } = require("express-validator");

// middleware catch errors from rules if exist and wrap it to return errors
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};
module.exports = validatorMiddleware;
