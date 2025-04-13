const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { editUserData } = require("../utils/validations");
const User = require("../models/user");
const { selectFeilds } = require("../utils/constants");
const { IncomingForm } = require("formidable");
const resumeUpload = require("../utils/resume-upload");

const userRouter = express.Router();

userRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.json({ loggedInUser });
  } catch (error) {}
});

userRouter.put("/profile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const form = new IncomingForm({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      const isEditAllowed = editUserData(fields);
      if (!isEditAllowed) {
        return res.status(400).json({ message: "Invalid fields for edit" });
      } else if (err) {
        return res.status(400).json({ message: "Something went wrong, please try again" });
      }
      const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;
      const result = await resumeUpload(resumeFile, loggedInUser);

      const { firstName, lastName, profilePic, skills, experience, education } = fields;
      const updatedUser = await User.findByIdAndUpdate(
        { _id: loggedInUser._id },
        {
          $set: {
            firstName: firstName[0],
            lastName: lastName[0],
            profilePic: profilePic[0],
            skills: JSON.parse(skills[0]),
            experience: +experience[0],
            education: JSON.parse(education[0]),
            resume: {
              publicId: loggedInUser.resume?.publicId ? loggedInUser.resume.publicId : result.public_id,
              cloudUrl: result.secure_url,
            },
          },
        }
      );
      req.user = updatedUser;
      res.json({ message: "User data updated successully", data: updatedUser });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
