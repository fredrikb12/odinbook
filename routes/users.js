const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoDB = require("../db-helpers/mongodb").mongoDB;
const {
  users_GET,
  users_userId_GET,
} = require("../controllers/userController");

/* GET users listing. */
router.get("/", users_GET);

router.get("/:userId", users_userId_GET);

/*router.post("/", async (req, res, next) => {
  const user = mongodb.postUser({});
});*/

module.exports = router;
