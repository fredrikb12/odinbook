const User = require("../models/user");
const { createResponse } = require("../utils/responseHelpers");

exports.users_GET = async (req, res, next) => {
  const users = await User.find().catch((e) => next(e));
  return createResponse(res, { users }, 200);
};

exports.users_userId_GET = async (req, res, next) => {
  let user;
  if (req.cookieToken._id === req.params.userId) {
    user = await User.findById(req.params.userId)
      .populate("friends", "name")
      .populate("requests", "name")
      .populate("posts")
      .catch((e) => next(e));
  } else {
    user = await User.findById(req.params.userId)
      .populate("friends posts")
      .catch((e) => next(e));
  }
  if (!user)
    return createResponse(res, { user: null, message: "User not found" }, 404);
  return createResponse(res, { user }, 200);
};
