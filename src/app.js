require("express-async-errors");
const routes = require("./routes");
const morgan = require("morgan");
const helmet = require("helmet");
const { errorHandler } = require("./middlewares/errorHandler");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("dev"));

// app.use("/api/v1", routes);
app.use("/api/v1", routes);
app.get("/api/v1", async (req, res) => {
  res.status(200).send("Welcome to API");
});

//errorHandler
app.use(errorHandler);

module.exports = app;
