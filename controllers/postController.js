const Post = require("../models/post");
const User = require("../models/user");
const { body } = require("express-validator");
const {
  hasValidationError,
  getValidationErrors,
} = require("../utils/validationHelpers");
const { createResponse } = require("../utils/responseHelpers");

exports.posts_POST = [
  body(),
  async (req, res, next) => {
    res.json({ message: "Post has been posted." });
  },
];
