const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoDB = require("../db-helpers/mongodb").mongoDB;
const {
  users_GET,
  users_userId_GET,
} = require("../controllers/userController");

router.get("/", users_GET);

router.get("/:userId", users_userId_GET);

router.post("/", async (req, res, next) => {
  const { name, facebook_id } = req.body;
  const user = new User({ name, facebook_id });
  const savedUser = await user.save().catch((e) => next(e));
  return res.status(200).json({ statusCode: 200, user: savedUser });
});

/*router.post("/", async (req, res, next) => {
  const user = mongodb.postUser({});
});*/

module.exports = router;
