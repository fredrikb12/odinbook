const express = require("express");
const router = express.Router();
const {
  posts_POST,
  posts_userIndexPosts_GET,
} = require("../controllers/postController");

router.post("/", posts_POST);

router.get("/", posts_userIndexPosts_GET);

//router.delete("/:postId", () => {});

module.exports = router;
