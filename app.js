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
const { genToken } = require("./utils/auth");

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
const { users_POST } = require("./controllers/userController");

const app = express();

require("./configs/passport");

const origins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8080",
  "https://fredrikb12.github.io",
];

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
app.use((req, res, next) => {
  if (origins.indexOf(req.headers.origin) !== -1) {
    console.log(req.headers.origin);
    console.log(origins.indexOf(req.headers.origin));
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  }
  next();
});

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
app.use(express.static(path.join(__dirname, "../client/build")));

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
      .cookie("odinbooktoken", auth.genToken(req.user), {
        sameSite: "none",
        secure: true,
        domain: "https://conservative-mountie-67830.herokuapp.com/",
        httpOnly: true,
      })
      .redirect("https://fredrikb12.github.io/odinbook-client");
  }
);

app.post("/users", users_POST);
app.post("/auth/login", async (req, res, next) => {
  console.log("logging in");
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return createResponse(res, {
        message: "Something is not right",
        user,
        errors: ["Incorrect username or password"],
      });
    } else {
      return res
        .status(200)
        .cookie("odinbooktoken", genToken(user), {
          sameSite: "none",
          secure: true,
          domain: "https://conservative-mountie-67830.herokuapp.com/",
          httpOnly: true,
        })
        .json({ user: user });
    }
  })(req, res, next);
});

app.use(jwtConfirmation);
app.use(jwtRenewer);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/friendrequests", fRequestRouter);
app.use("/posts", postsRouter);
app.use("/likes", likesRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authRouter);

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send("Something has gone wrong.");
});
module.exports = app;
