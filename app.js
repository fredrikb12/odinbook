const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
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
const postsRouter = require("./routes/posts");
const fRequestRouter = require("./routes/friendRequests");
const likesRouter = require("./routes/likes");
const commentsRouter = require("./routes/comments");
const authRouter = require("./routes/auth");
const { jwtRenewer } = require("./middleware/jwtRenewer");

const app = express();

require("./configs/passport");

const origins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(helmet());

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
      .redirect("http://localhost:3001/login-redirect");
  }
);

app.use(jwtConfirmation);
app.use(jwtRenewer);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/friendrequests", fRequestRouter);
app.use("/posts", postsRouter);
app.use("/likes", likesRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authRouter);
module.exports = app;
