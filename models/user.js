const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 1 },
  facebook_id: { type: String },
  picture: { type: String, required: false },
});

module.exports = mongoose.model("User", UserSchema);
