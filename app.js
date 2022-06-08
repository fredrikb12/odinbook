const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
require("dotenv").config();
require("./configs/mongoConfig");
const session = require("express-session");

const User = require("./models/user");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

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
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/login/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/redirect/facebook",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    console.log("authentication succeeded");
    console.log(req.user);
    res.redirect("/");
  }
);

module.exports = app;
