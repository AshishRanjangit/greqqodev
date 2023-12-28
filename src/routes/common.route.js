const express = require("express");
const multer = require("multer");
const commonController = require("../controller/common.controller");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

const commoRoute = express.Router();

commoRoute.post("/upload", upload.single("file"), commonController.uploadFile);

module.exports = commoRoute;
