const Comment = require("../models/comment");
const Post = require("../models/post");
const { body } = require("express-validator");
const {
  hasValidationError,
  getValidationErrors,
} = require("../utils/validationHelpers");
const { createResponse } = require("../utils/responseHelpers");

exports.comments_POST = [
  body("postId", "Post ID is required")
    .exists()
    .escape()
    .custom(async (postId) => {
      const foundPost = await Post.findById(postId).catch((e) =>
        Promise.reject("Something went wrong finding this post")
      );
      if (!foundPost) {
        return Promise.reject("No post with this id found.");
      } else {
        return Promise.resolve(postId);
      }
    }),
  body("text", "text is required").exists().escape(),
  async (req, res, next) => {
    if (hasValidationError(req)) {
      return createResponse(
        res,
        {
          message: "Something went wrong posting this comment.",
          errors: getValidationErrors(req),
        },
        400
      );
    }

    const currentUserId = req.cookieToken._id;
    const postId = req.body.postId;

    try {
      const comment = new Comment({
        text: req.body.text.replace(/&#x27;/g, "'"),
        user: currentUserId,
        post: postId,
      });
      const savedComment = comment.save();
      const savedPost = Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
      });
      const promises = await Promise.all([savedComment, savedPost]);
      return createResponse(
        res,
        { message: "Comment successfully posted.", comment: promises[0] },
        200
      );
    } catch (e) {
      return next(e);
    }
  },
];
