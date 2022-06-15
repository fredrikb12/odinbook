const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.friendRequests_POST = [
  body("receiver", "Receiving user must be specified")
    .exists()
    .escape()
    .custom(async (id) => {
      const foundUser = await User.findById(id).catch((e) => Promise.reject(e));
      if (!foundUser) return Promise.reject("No receiving user found.");
      else return Promise.resolve(id);
    }),
  async (req, res, next) => {
    const errors = validationResult(body);
    if (!errors.isEmpty)
      return res.status(400).json({
        statusCode: 400,
        message: "No receiving user was sent to the server",
        errors,
      });

    const sender = req.cookieToken._id;
    const receiver = req.body.receiver;
    const prevRequest = await FriendRequest.findOne({ sender, receiver }).catch(
      (e) => next(e)
    );
    if (prevRequest)
      return res
        .status(400)
        .json({ message: "Request already sent.", statusCode: 400 });

    const friendRequest = new FriendRequest({
      sender,
      receiver,
    });
    const friendRequestId = friendRequest._id;
    const savedRequest = friendRequest.save().catch((e) => next(e));

    const savedSender = User.findByIdAndUpdate(sender, {
      $push: { requests: friendRequest },
    }).catch((e) => next(e));

    const savedReceiver = User.findByIdAndUpdate(receiver, {
      $push: { requests: friendRequest },
    }).catch((e) => next(e));

    const waitForPushes = await Promise.all([
      savedRequest,
      savedSender,
      savedReceiver,
    ]).catch((e) => next(e));

    return res.status(200).json({
      request: waitForPushes[0],
      sender: waitForPushes[1].name,
      receiver: waitForPushes[2].name,
      message: "Friend request sent",
    });
  },
];

exports.friendRequests_DELETE = async (req, res, next) => {
  const requestId = req.params.friendRequestId;
  const foundRequest = await FriendRequest.findById(requestId)
    .populate("sender receiver", "name")
    .catch((e) => next(e));
  console.log(foundRequest.sender._id.toString());
  console.log(req.cookieToken._id);
  if (!foundRequest)
    return res
      .status(404)
      .json({ request: null, message: "Friend request does not exist." });
  else if (
    foundRequest.sender._id.toString() === req.cookieToken._id ||
    foundRequest.receiver._id.toString() === req.cookieToken._id
  ) {
    const deletedRequest = await FriendRequest.findByIdAndDelete(
      requestId
    ).catch((e) => next(e));
    return res
      .status(200)
      .json({ request: foundRequest, message: "Request has been deleted." });
  } else {
    return res
      .status(403)
      .json({ request: null, message: "You can't access this resource." });
  }
};
