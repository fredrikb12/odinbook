const express = require("express");
const router = express.Router();
const { likes_POST } = require("../controllers/likeController");

router.post("/", likes_POST);

module.exports = router;
