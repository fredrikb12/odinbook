const Like = require("../models/like");
const Post = require("../models/post");
const { body } = require("express-validator");
const {
  hasValidationError,
  getValidationErrors,
} = require("../utils/validationHelpers");
const { createResponse } = require("../utils/responseHelpers");

exports.likes_POST = [
  body("postId")
    .exists()
    .escape()
    .custom(async (postId) => {
      const foundPost = await Post.findById(postId).catch((e) =>
        Promise.reject("Something went wrong finding this post")
      );
      if (!foundPost) {
        return Promise.reject("No post with this id found");
      } else {
        return Promise.resolve(postId);
      }
    }),
  async (req, res, next) => {
    if (hasValidationError(req)) {
      return createResponse(
        res,
        {
          message: "Something went wrong liking this post.",
          errors: getValidationErrors(req),
        },
        400
      );
    }

    const currentUserId = req.cookieToken._id;
    const postId = req.body.postId;

    try {
      const like = new Like({ post: postId, user: currentUserId });
      const savedLike = like.save();
      const savedPost = Post.findByIdAndUpdate(postId, {
        $push: { likes: like._id },
      });
      const promises = await Promise.all([savedLike, savedPost]);
      return createResponse(res, { message: "Post successfully liked." }, 200);
    } catch (e) {
      return next(e);
    }
  },
];
