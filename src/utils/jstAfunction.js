const Company = require("../models/adCompanies");

exports.test = async () => {
  let company = await Company.findOne({
    name: { $regex: new RegExp(`^${"abc"}$`, "i") },
  });

  console.log("This is company>>>>>>>>>>>>>>", company);
};
