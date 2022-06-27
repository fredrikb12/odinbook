const express = require("express");
const router = express.Router();
const {
  posts_POST,
  posts_userIndexPosts_GET,
  posts_postId_DELETE,
} = require("../controllers/postController");

router.post("/", posts_POST);

router.get("/", posts_userIndexPosts_GET);

router.delete("/:postId", posts_postId_DELETE);

module.exports = router;
