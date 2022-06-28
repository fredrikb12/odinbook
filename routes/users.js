const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoDB = require("../db-helpers/mongodb").mongoDB;
const {
  users_GET,
  users_userId_GET,
  users_userId_removeFriend,
  users_POST,
} = require("../controllers/userController");

router.get("/", users_GET);

router.get("/:userId", users_userId_GET);

router.post("/", users_POST);

router.put("/:userId/remove", users_userId_removeFriend);

module.exports = router;
