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

exports.createCategory = async (data) => {
  const category = await Category.findOne({
    name: data.name.toLocaleLowerCase(),
  });

  if (category)
    throw new BadRequestError(
      `Category with name (${data.name.toLocaleLowerCase()}) already exists`
    );

  await Category.create({ name: data.name.toLocaleLowerCase() });

  return serviceResponse(200, {}, "Category created succefully");
};

exports.createSubcategory = async (data) => {
  const subcategory = await Subcategory.findOne({
    name: data.name.toLocaleLowerCase(),
  });

  if (subcategory)
    throw new BadRequestError(
      `Subcategory with name ${data.email.toLocaleLowerCase()} already exists`
    );

  const category = await Category.findById(data.categoryId);

  if (!category) throw new BadRequestError("Wrong categoryId");

  await Subcategory.create({
    name: data.name.toLocaleLowerCase(),
    category: data.categoryId,
  });

  return serviceResponse(200, {}, "Subcategory created succefully");
};
