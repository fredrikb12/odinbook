const express = require("express");
const router = express.Router();
const { comments_POST } = require("../controllers/commentController");

router.post("/", comments_POST);

module.exports = router;
