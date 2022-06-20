const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
require("dotenv").config();
require("./configs/mongoConfig");
const session = require("express-session");
const jwtConfirmation = require("./middleware/jwtAuth");
const auth = require("./utils/auth");

const User = require("./models/user");
const Comment = require("./models/comment");
const FriendRequest = require("./models/friendRequest");
const Like = require("./models/like");
const Post = require("./models/post");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const fRequestRouter = require("./routes/friendRequests");
const { jwtRenewer } = require("./middleware/jwtRenewer");

const app = express();

require("./configs/passport");

app.use(
  session({
    secret: process.env.SECRET_STRING,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/login/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/redirect/facebook",
  passport.authenticate("facebook", {
    failureRedirect: "/login/facebook",
    failureMessage: true,
  }),
  (req, res) => {
    console.log("authentication succeeded");
    console.log(req.user);
    console.log("setting token:", auth.genToken(req.user));
    return res
      .cookie("odinbooktoken", auth.genToken(req.user), { httpOnly: true })
      .redirect("/");
  }
);

app.use(jwtConfirmation);
app.use(jwtRenewer);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/friendrequests", fRequestRouter);

module.exports = app;
