const express = require("express");
const authRouter = express.Router();
const { validateRegisterData } = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/register", async (req, res) => {
  try {
    validateRegisterData(req.body);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 15);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save(newUser);
    const token = savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 5 * 3600000),
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 5 * 3600000),
      });
      res.send({ user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("You have been logged out");
});

module.exports = authRouter;
