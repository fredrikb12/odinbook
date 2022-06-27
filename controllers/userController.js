const User = require("../models/user");
const FriendRequest = require("../models/friendRequest");
const { createResponse } = require("../utils/responseHelpers");
const { body } = require("express-validator");
const {
  hasValidationError,
  getValidationErrors,
} = require("../utils/validationHelpers");

exports.users_GET = async (req, res, next) => {
  const users = await User.find()
    .populate({ path: "requests", select: "sender receiver accepted" })
    .catch((e) => next(e));
  return createResponse(res, { users }, 200);
};

exports.users_userId_GET = async (req, res, next) => {
  let user;
  if (req.cookieToken._id === req.params.userId) {
    user = await User.findById(req.params.userId)
      .populate("friends", "name")
      .populate({
        path: "requests",
        populate: [
          {
            path: "sender",
            select: "name",
          },
          { path: "receiver", select: "name" },
        ],
      })
      .populate({
        path: "posts",
        populate: [
          { path: "user", select: "name picture" },
          { path: "likes", populate: { path: "user", select: "name" } },
          { path: "comments", populate: { path: "user", select: "name" } },
        ],
      })
      .catch((e) => next(e));
  } else {
    user = await User.findById(req.params.userId)
      .populate({
        path: "friends",
        select: "name",
        populate: [
          {
            path: "name",
            select: "",
          },
        ],
      })
      .populate({
        path: "posts",
        populate: [
          { path: "user", select: "name picture " },
          { path: "likes", populate: { path: "user", select: "name" } },
          { path: "comments", populate: { path: "user", select: "name" } },
        ],
      })
      .catch((e) => next(e));
  }
  if (!user)
    return createResponse(res, { user: null, message: "User not found" }, 404);
  return createResponse(res, { user }, 200);
};

exports.users_userId_removeFriend = [
  body("userId", "User ID must be specified")
    .exists()
    .escape()
    .custom(async (id) => {
      const user = await User.findById(id).catch((e) => Promise.reject(e));
      if (user) return Promise.resolve(user);
      else return Promise.reject("No user found with this ID.");
    }),
  async (req, res, next) => {
    if (hasValidationError(req)) {
      return createResponse(
        res,
        { errors: getValidationErrors(req), message: "No user found" },
        404
      );
    }
    const currentUser = req.cookieToken._id;
    const targetUser = req.body.userId;

    try {
      const savedCurrent = await User.findByIdAndUpdate(currentUser, {
        $pull: { friends: targetUser },
      });
      const savedTarget = await User.findByIdAndUpdate(targetUser, {
        $pull: { friends: currentUser },
      });
      const deletedRequest = await FriendRequest.findOneAndDelete({
        $or: [
          {
            sender: targetUser,
            receiver: currentUser,
          },

          {
            sender: currentUser,
            receiver: targetUser,
          },
        ],
      });
      return createResponse(res, { request: deletedRequest }, 200);
    } catch (e) {
      return next(e);
    }
  },
];
