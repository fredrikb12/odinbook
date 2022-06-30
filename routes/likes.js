const express = require("express");
const router = express.Router();
const { likes_POST, likes_DELETE } = require("../controllers/likeController");

router.post("/", likes_POST);

router.delete("/", likes_DELETE);

module.exports = router;
