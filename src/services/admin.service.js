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
const Ad = require("../models/ad");

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

exports.getAllAdds = async (queryData) => {
  const query = {};

  if (queryData.status) query.status = queryData.status;
  if (queryData.user) query.user = queryData.user;
  if (queryData.category) query.category = queryData.category;
  if (queryData.transmission) query.transmission = queryData.transmission;
  if (queryData.fuel) query.fuel = queryData.fuel;
  if (queryData.subcategory) query.subcategory = queryData.subcategory;
  if (queryData.occupancy) query.occupancy = queryData.occupancy;
  if (queryData.construnction) query.construnction = queryData.construnction;
  if (queryData.listedBy) query.listedBy = queryData.listedBy;
  if (queryData.keyword) {
    query["$or"] = [
      { description: { $regex: queryData.keyword, $options: "i" } }, // case-insensitive
      { title: { $regex: queryData.keyword, $options: "i" } },
      { locality: { $regex: queryData.keyword, $options: "i" } },
      { brand: { $regex: queryData.keyword, $options: "i" } },
    ];
  }
  if (queryData.city) query.status = { $regex: queryData.city, $options: "i" };
  if (queryData.city) query.state = { $regex: queryData.state, $options: "i" };
  if (queryData.city)
    query.locality = { $regex: queryData.locality, $options: "i" };
  if (queryData.smallPrice && queryData.bigPrice) {
    if (Number(queryData.smallPrice) > Number(queryData.bigPrice))
      throw new BadRequestError(
        "small price cannot be greater than equal to bigPrice"
      );
    if (
      typeof Number(queryData.smallPrice) !== "number" ||
      typeof Number(queryData.bigPrice) !== "number"
    )
      throw new BadRequestError("price should be a number");
    query.price = {
      $gte: Number(queryData.smallPrice),
      $lte: Number(queryData.bigPrice),
    };
  }

  const [ads, adsCount] = await Promise.all([
    Ad.find(query)
      .populate(
        "user",
        "userName email  phoneNumber  company state city address pincode  "
      )
      .populate("category", "name")
      .populate("subcategory", "name")
      .select(
        "title description createdAt category subcategory status price locality brand fuel transmission photos construnction occupancy listedBy"
      )
      .sort({ createdAt: -1 })
      .limit(queryData.limit)
      .skip(queryData.limit * (queryData.page - 1)),
    Ad.countDocuments(query),
  ]);

  return serviceResponse(200, { ads, adsCount }, "Ads fetched succefully");
};

exports.updateStatusAd = async (id, status) => {
  let ad = await Ad.findByIdAndUpdate(id, { $set: status });
  if (ad) {
    throw new BadRequestError("No such ads found with this Id");
  }
  return serviceResponse(200, { ad }, "Ad status updated succesfully");
};

exports.getAd = async (id) => {
  let ad = await Ad.findById(id)
    .populate(
      "user",
      "userName email  phoneNumber  company state city address pincode "
    )
    .populate("category", "name")
    .populate("subcategory", "name");
  if (ad) {
    throw new BadRequestError("No such ads found with this Id");
  }
  return serviceResponse(200, { ad }, "Ad fetched succefully");
};

exports.getUsers = async (queryData) => {
  const query = {};
  if (queryData.keyword) {
    query["$or"] = [
      { description: { $regex: queryData.keyword, $options: "i" } }, // case-insensitive
      { title: { $regex: queryData.keyword, $options: "i" } },
      { locality: { $regex: queryData.keyword, $options: "i" } },
      { brand: { $regex: queryData.keyword, $options: "i" } },
    ];
  }
  let users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(queryData.limit)
    .skip(queryData.limit * (queryData.page - 1));

  return serviceResponse(200, { users }, "users fetched succefully");
};
