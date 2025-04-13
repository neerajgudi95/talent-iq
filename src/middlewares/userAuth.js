const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { selectFeilds } = require("../utils/constants");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("User unauthorized");
    }
    const { _id } = jwt.decode(token);
    const user = await User.findById(_id).select(selectFeilds);
    if (!user) {
      throw new Error("No user found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = userAuth;
