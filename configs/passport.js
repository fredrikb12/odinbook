const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const User = require("../models/user");
const mongoDB = require("../db-helpers/mongodb").mongoDB;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: "http://localhost:3000/auth/redirect/facebook",
      enableProof: true,
    },
    (accessToken, refreshToken, profile, cb) => {
      mongoDB.findOrCreateNewUser(accessToken, refreshToken, profile, cb);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error("Failed to deserialize an user"));
    });
});
