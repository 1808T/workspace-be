const express = require("express");
const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  res.json({ message: "Done." });
});

module.exports = userRouter;
