const express = require("express");
const router = express.Router();
const { posts_POST } = require("../controllers/postController");

router.post("/", posts_POST);
