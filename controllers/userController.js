const User = require("../models/user");
const FriendRequest = require("../models/friendRequest");
const { createResponse } = require("../utils/responseHelpers");
const { body } = require("express-validator");
const {
  hasValidationError,
  getValidationErrors,
} = require("../utils/validationHelpers");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { genToken } = require("../utils/auth");

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
      .populate("requests", "sender receiver accepted")
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
      const savedCurrent = await User.findByIdAndUpdate(currentUser, {
        $pull: { friends: targetUser, requests: deletedRequest?._id },
      });
      const savedTarget = await User.findByIdAndUpdate(targetUser, {
        $pull: { friends: currentUser, requests: deletedRequest?._id },
      });

      return createResponse(res, { request: deletedRequest }, 200);
    } catch (e) {
      return next(e);
    }
  },
];

exports.users_POST = [
  body("name", "Name is required")
    .exists()
    .escape()
    .isLength({ min: 1, max: 100 }),
  body("username", "Username must be a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false }),
  body("password", "Password must be at least 5 characters long.")
    .trim()
    .isLength({ min: 5, max: 50 })
    .escape(),
  body("password_confirm", "Passwords must match")
    .exists()
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password),
  async (req, res, next) => {
    if (hasValidationError(req)) {
      return createResponse(
        res,
        {
          name: req.body.name || "",
          username: req.body.username || "",
          errors: [...getValidationErrors(req).errors],
        },
        400
      );
    }
    const user = await User.findOne({ username: req.body.username }).catch(
      (e) => next(e)
    );
    if (user) {
      return createResponse(
        res,
        {
          name: req.body.name || "",
          username: req.body.username || "",
          errors: ["Email is already in use."],
        },
        200
      );
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          name: req.body.name,
          username: req.body.username,
          password: hashedPassword,
        });
        const savedUser = await user.save().catch((e) => next(e));
        return res
          .cookie("odinbooktoken", genToken(savedUser), {
            httpOnly: true,
            SameSite: "none",
        secure: true,
          })
          .status(201)
          .json({ user: savedUser._id });
      });
    }
  },
];
