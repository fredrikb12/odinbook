const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    text: { type: String, required: true, maxlength: 2000 },
    likes: [{ type: Schema.Types.ObjectId, required: true, ref: "Like" }],
    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: { currentTime: () => Date.now() } }
);

module.exports = mongoose.model("Post", PostSchema);
