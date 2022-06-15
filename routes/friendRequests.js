const express = require("express");
const router = express.Router();
const {
  friendRequests_POST,
  friendRequests_DELETE,
} = require("../controllers/friendRequestController");

router.post("/", friendRequests_POST);

router.delete("/:friendRequestId", friendRequests_DELETE);

module.exports = router;
