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

exports.posts_userIndexPosts_GET = async (req, res, next) => {
  const currentUserId = req.cookieToken._id;
  const currentUser = await User.findById(currentUserId)
    .populate({
      path: "posts",
      populate: [
        { path: "user", select: "name picture" },
        { path: "likes", populate: { path: "user", select: "name picture" } },
        {
          path: "comments",
          populate: { path: "user", select: "name picture" },
        },
      ],
    })
    .catch((e) => next(e));
  if (!currentUser) {
    return createResponse(
      res,
      { message: "This user does not exist.", posts: [], user: currentUserId },
      404
    );
  } else {
    const friends = await User.find({
      friends: currentUserId,
    })
      .populate({
        path: "posts",
        populate: [{ path: "user", select: "name picture" }],
      })
      .select("posts")
      .sort({ createdAt: "desc" });
    const friendPosts = friends
      .map((friend) => {
        return friend.posts;
      })
      .reduce((postsArray, returnArray) => {
        returnArray = [...returnArray, ...postsArray];
        return returnArray;
      }, []);
    const userPosts = currentUser.posts.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return createResponse(res, { posts: [...userPosts, ...friendPosts] }, 200);
  }
};
