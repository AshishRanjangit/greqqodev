const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const { connectToDb } = require("./config/dbConnect");

const startServer = async () => {
  await connectToDb();

  const PORT = process.env.PORT;
  app.listen(PORT || "6000", () =>
    console.log(`👉👉 App listening on port ${PORT || "6000"} 👈👈`)
  );
};
startServer();
