const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },

    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },

    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email ID is invalid");
        }
      },
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: {
        values: ["internal", "external"],
        message: `{VALUE} is not a valid role`,
      },
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo url is invalid");
        }
      },
    },

    resume: {
      publicId: { type: String },
      cloudUrl: { type: String },
    },

    skills: { type: [String] },

    experience: { type: Number },

    education: {
      type: [
        {
          degree: String,
          institution: String,
          year: Number,
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(userPassword, passwordHash);
  return isPasswordValid;
};


module.exports = new mongoose.model("User", userSchema);
