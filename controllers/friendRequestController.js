const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const {
  hasValidationError,
  getValidationErrors,
} = require("../utils/validationHelpers");
const { createResponse } = require("../utils/responseHelpers");

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
    if (hasValidationError(req)) {
      return createResponse(
        res,
        {
          message: "No receiving user was sent to the server",
          errors: getValidationErrors(req),
        },
        400
      );
    }

    const sender = req.cookieToken._id;
    const receiver = req.body.receiver;
    const prevRequest = await FriendRequest.findOne({ sender, receiver }).catch(
      (e) => next(e)
    );
    if (prevRequest) {
      return createResponse(res, { message: "Request already sent." }, 400);
    }

    try {
      const friendRequest = new FriendRequest({
        sender,
        receiver,
      });
      const friendRequestId = friendRequest._id;
      const savedRequest = friendRequest.save();

      const savedSender = User.findByIdAndUpdate(sender, {
        $push: { requests: friendRequestId },
      });

      const savedReceiver = User.findByIdAndUpdate(receiver, {
        $push: { requests: friendRequestId },
      });

      const waitForPushes = await Promise.all([
        savedRequest,
        savedSender,
        savedReceiver,
      ]);
      return createResponse(
        res,
        {
          request: waitForPushes[0],
          sender: waitForPushes[1].name,
          receiver: waitForPushes[2].name,
          message: "Friend request sent",
        },
        200
      );
    } catch (e) {
      return next(e);
    }
  },
];

exports.friendRequests_DELETE = async (req, res, next) => {
  const requestId = req.params.friendRequestId;
  const foundRequest = await FriendRequest.findById(requestId)
    .populate("sender receiver", "name")
    .catch((e) => next(e));
  if (!foundRequest) {
    return createResponse(
      res,
      { request: null, message: "Friend request does not exist." },
      404
    );
  } else if (
    foundRequest.sender._id.toString() === req.cookieToken._id ||
    foundRequest.receiver._id.toString() === req.cookieToken._id
  ) {
    try {
      const deletedRequest = FriendRequest.findByIdAndDelete(requestId).exec();
      const deletedSenderReq = User.findByIdAndUpdate(foundRequest.sender._id, {
        $pull: { requests: requestId },
      }).exec();

      const deletedReceiverReq = User.findByIdAndUpdate(
        foundRequest.receiver._id,
        {
          $pull: { requests: requestId },
        }
      ).exec();

      const promises = await Promise.all([
        deletedRequest,
        deletedSenderReq,
        deletedReceiverReq,
      ]);
      const foundRejection = promises?.find(
        (promise) => promise.status === "rejected"
      );
      if (foundRejection) {
        return next(
          new Error("Something went wrong deleting this friend request")
        );
      }
      return createResponse(
        res,
        { request: foundRequest, message: "Request has been deleted." },
        200
      );
    } catch (e) {
      return next(e);
    }
  } else {
    return createResponse(
      res,
      { request: null, message: "You can't access this resource." },
      403
    );
  }
};

/*exports.friendRequests_PUT = [
  body("requestAction", "Request action must be specified").exists().escape(),
  async (req, res, next) => {
    if (hasValidationError(req)) {
      return createResponse(
        res,
        { message: "Something went wrong handling this friend request." },
        400
      );
    }
    const currentUserId = req.cookieToken._id;
    const requestId = req.params.friendRequestId;
  },
];*/
