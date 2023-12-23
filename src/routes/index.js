const express = require("express");
const accountRoute = require("./account.route");
const adminRoute = require("./admin.route");
const adRoute = require("./ad.route");
const router = express.Router();
router.use("/account", accountRoute);
router.use("/admin", adminRoute);
router.use("/ads", adRoute);
module.exports = router;
