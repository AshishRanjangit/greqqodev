const mongoose = require("mongoose");

exports.connectToDb = async () => {
  const dbConnect = new Promise((resolve, reject) => {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Database connection has been established");
        resolve("Database connection has been established");
      })
      .catch((err) => reject(err));
  });

  return dbConnect;
};
