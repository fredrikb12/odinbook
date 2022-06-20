const { validationResult } = require("express-validator");

exports.hasValidationError = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return true;
  }
  return false;
};

exports.getValidationErrors = (req) => {
  const errors = validationResult(req);
  return errors;
};
