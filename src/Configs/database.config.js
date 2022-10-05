const mongoose = require("mongoose");
const env = require("./environment.config");

const connectToDatabase = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  mongoose
    .connect(env.MONGODB_URI, connectionParams)
    .then(() => {
      console.log("Successfully connect to database!!!");
    })
    .catch(error => {
      console.log(`Failed to connect.`);
      console.log(`Detail: ${error}`);
    });
};

module.exports = connectToDatabase;
