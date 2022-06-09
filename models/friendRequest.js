const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    read: { type: Boolean, required: true, default: false },
    accepted: { type: Boolean, required: true, default: false },
    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: { currentTime: () => Date.now() } }
);

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);
