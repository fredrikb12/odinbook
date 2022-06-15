const express = require("express");
const router = express.Router();
const {
  friendRequests_POST,
} = require("../controllers/friendRequestController");

router.post("/", friendRequests_POST);

module.exports = router;
