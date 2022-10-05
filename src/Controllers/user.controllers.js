const User = require("../Models/user");

exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    role = "user"
  } = req.body;
};
