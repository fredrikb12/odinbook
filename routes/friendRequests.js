const express = require("express");
const router = express.Router();
const {
  friendRequests_POST,
  friendRequests_CANCEL,
  friendRequests_PUT,
} = require("../controllers/friendRequestController");

router.post("/", friendRequests_POST);

router.delete("/:friendRequestId", friendRequests_CANCEL);

router.put("/:friendRequestId", friendRequests_PUT);

module.exports = router;
