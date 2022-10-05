const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const env = require("./src/Configs/environment.config");
const connectToDatabase = require("./src/Configs/database.config");

const userRouter = require("./src/Routes/user.route");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!!!" });
});

const PORT = env.PORT || 8000;
app.listen(PORT, error => {
  if (error) console.log(err);
  connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});
