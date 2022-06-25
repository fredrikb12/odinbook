const express = require("express");
const router = express.Router();
const { createResponse } = require("../utils/responseHelpers");

router.get("/success", (req, res, next) => {
  if (req.cookieToken._id) {
    return createResponse(res, { userId: req.cookieToken._id }, 200);
  } else {
    return createResponse(res, { userId: null }, 401);
  }
});

router.get("/logout", (req, res, next) => {
  return res.clearCookie("odinbooktoken").send();
});

module.exports = router;
