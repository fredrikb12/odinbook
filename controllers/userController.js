const User = require("../models/user");

exports.users_GET = async (req, res, next) => {
  const users = await User.find().catch((e) => next(e));
  return res.status(200).json({ users, statusCode: 200 });
};

exports.users_userId_GET = async (req, res, next) => {
  let user;
  if (req.cookieToken._id === req.params.userId) {
    user = await User.findById(req.params.userId)
      .populate("friends requests posts")
      .catch((e) => next(e));
  } else {
    user = await User.findById(req.params.userId)
      .populate("friends posts")
      .catch((e) => next(e));
  }
  if (!user)
    return res
      .status(404)
      .json({ user: null, statusCode: 404, message: "User not found" });
  return res.status(200).json({ user, statusCode: 200 });
};
