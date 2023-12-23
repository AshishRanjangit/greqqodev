const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Otp = require("../models/otp");
const { generateToken } = require("../utils/jwt");
const { serviceResponse } = require("../utils/serviceResponse");
const { generateOTP } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/sendMail");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");

exports.getCategory = async () => {
  const category = await Category.find().select("name");

  return serviceResponse(200, { category }, "Category fetched succefully");
};

exports.getSubcategory = async (data) => {
  const subcategory = await Subcategory.find({
    category: data.categoryId,
  })
    .select("name category")
    .populate("category", "name");

  if (!subcategory.length) throw new BadRequestError("Wrong categoryId");

  return serviceResponse(
    200,
    { subcategory },
    "Subcategory fetched succefully"
  );
};
