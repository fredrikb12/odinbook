const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 1 },
  facebook_id: { type: String, required: true },
  picture: { type: String, required: false },
  friends: [
    { type: Schema.Types.ObjectId, ref: "User", required: true, default: [] },
  ],
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: "FriendRequest",
      required: true,
      default: [],
    },
  ],
  posts: [
    { type: Schema.Types.ObjectId, ref: "Post", required: true, default: [] },
  ],
});

module.exports = mongoose.model("User", UserSchema);
