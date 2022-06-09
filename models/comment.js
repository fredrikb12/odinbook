const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    text: { type: String, required: true, maxLength: 200 },
    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: { currentTime: () => Date.now() } }
);

module.exports = mongoose.model("Comment", CommentSchema);
