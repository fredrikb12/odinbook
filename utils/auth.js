const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = {
  genToken: (user) => {
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1800s",
    });
  },

  tokenUpdated: (user, params) => {
    const obj = { ...user, cookieStatus: "Updated" };
    return loopOverKeys(obj, params);
  },

  tokenNotUpdated: (user, params) => {
    const obj = { ...user, cookieStatus: "Not Updated" };
    return loopOverKeys(obj, params);
  },

  tokenNeedsUpdate: (req) => {
    if (req.exp - new Date().getTime() / 1000 < 600) return true;
    else return false;
  },
};

function loopOverKeys(object, keysToLoop) {
  const obj = { ...object };
  Object.keys(keysToLoop).forEach((key) => {
    obj[key] = keysToLoop[key];
  });
  return obj;
}

module.exports = auth;
