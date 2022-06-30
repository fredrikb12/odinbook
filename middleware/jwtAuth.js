const auth = require("../utils/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuth = (req, res, next) => {
  const token = req.cookies.odinbooktoken;
  if (!token) {
    console.log("no token found; redirecting...");
    return res.status(403).json({ user: null });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log(data);
    req.cookieToken = {
      _id: data._id,
      iat: data.iat,
      exp: data.exp,
    };
    next();
  } catch (e) {
    return res.status(403).json({ message: "Something went wrong." });
  }
};

module.exports = jwtAuth;
