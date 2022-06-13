const User = require("../models/user");

exports.mongoDB = {
  findUser: async (query, cb) => {
    const user = await User.findOne(query).catch((e) => cb(e));
    if (user) return user;
    else return null;
  },
  findUsers: async (query) => {
    const users = await User.find(query || null);
    return users;
  },
  createUser: async (user, cb) => {
    const newUser = new User(user);
    const savedUser = await newUser.save().catch((e) => cb(e));
    return cb(null, savedUser);
  },
};
