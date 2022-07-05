const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const User = require("../models/user");
const mongoDB = require("../db-helpers/mongodb").mongoDB;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: "auth/redirect/facebook",
      enableProof: true,
      profileFields: ["id", "displayName", "photos"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      const foundUser = await mongoDB
        .findUser({ facebook_id: profile.id }, cb)
        .catch((e) => cb(e));
      if (!foundUser) {
        mongoDB.createUser(
          {
            name: profile.displayName,
            facebook_id: profile.id,
            picture: profile._json.picture.data.url || null,
          },
          cb
        );
      } else {
        cb(null, foundUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    } catch (e) {
      done(e);
    }
  })
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
