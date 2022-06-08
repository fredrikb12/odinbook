const User = require("../models/user");

exports.mongoDB = {
  findOrCreateNewUser: (accessToken, refreshToken, profile, cb) => {
    User.findOne({ facebook_id: profile.id }, function (err, user) {
      if (err) return cb(err);
      if (user) return cb(null, user);
      else {
        newUser = new User({
          facebook_id: profile.id,
          name: profile.displayName,
        });
        newUser.save(function (err) {
          if (err) return cb(err);
          else {
            console.log("saving user...");
            return cb(null, newUser);
          }
        });
      }
    });
  },
};
