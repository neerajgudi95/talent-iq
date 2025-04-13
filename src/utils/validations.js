const validator = require("validator");

const validateRegisterData = (req) => {
  const { firstName, lastName, email, password } = req;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const editUserData = (req) => {
  const allowedFields = ["firstName", "lastName", "profilePic", "resume", "skills", "experience", "education"];
  const isEditAllowed = Object.keys(req).every((field) => allowedFields.includes(field));
  return isEditAllowed;
};

module.exports = {
  validateRegisterData,
  editUserData,
};
