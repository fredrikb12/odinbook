const { genToken } = require("../utils/auth");

exports.jwtRenewer = (req, res, next) => {
  const token = req.cookieToken;
  const expiry = token.exp;

  //if jwt expires within 15 minutes
  if (expiry - new Date().getTime() / 1000 < 900) {
    res.cookie("odinbooktoken", genToken(token), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
  next();
};
