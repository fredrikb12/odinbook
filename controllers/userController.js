const User = require("../models/user");
const { createResponse } = require("../utils/responseHelpers");

exports.users_GET = async (req, res, next) => {
  const users = await User.find()
    .populate({ path: "requests", select: "sender receiver" })
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
          { path: "user", select: "name " },
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
          { path: "user", select: "name " },
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
