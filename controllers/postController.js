const Post = require("../models/post");
const User = require("../models/user");
const { body } = require("express-validator");
const {
  hasValidationError,
  getValidationErrors,
} = require("../utils/validationHelpers");
const { createResponse } = require("../utils/responseHelpers");

exports.posts_POST = [
  body("text", "text is required")
    .exists()
    .escape()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Text cannot be longer than 2000 characters."),
  async (req, res, next) => {
    if (hasValidationError(req)) {
      return createResponse(
        res,
        {
          message: "Something went wrong posting this post.",
          errors: getValidationErrors(req),
        },
        400
      );
    }
    try {
      const post = new Post({
        user: req.cookieToken._id,
        text: req.body.text.replace(/&#x27;/g, "'"),
      });

      const savedPost = post.save();
      const savedUser = User.findByIdAndUpdate(req.cookieToken._id, {
        $push: { posts: post._id },
      });

      const promises = await Promise.all([savedPost, savedUser]);

      return createResponse(
        res,
        { message: "Post has been posted.", post: promises[0] },
        200
      );
    } catch (e) {
      return next(e);
    }
  },
];
