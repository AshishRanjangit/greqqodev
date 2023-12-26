const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcrypt");
const Otp = require("../models/otp");
const { generateToken } = require("../utils/jwt");
const { serviceResponse } = require("../utils/serviceResponse");
const { generateOTP } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/sendMail");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Ad = require("../models/ad");
const User = require("../models/user");

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

exports.postAd = async (userId, data) => {
  if (data.category) {
    console.log("userId>>>>>>>>>>>>>", userId);
    let user = await User.findById(userId).select("email");

    console.log("this is userdfhd>>>>>>>", user);
    let category = await Category.findById(data.category);
    if (!category) throw new BadRequestError("No such category exists");
    if (!data.subcategory) throw new BadRequestError("Subcategory is required");
    let subcategory = await Subcategory.findOne({
      _id: data.subcategory,
      category: data.category,
    });

    if (!subcategory) throw new BadRequestError("No such subcategory exists");

    if (subcategory.name === "car") {
      const requiredFields = [
        "title",
        "description",
        "price",
        "brand",
        "model",
        "fuel",
        "transmission",
        "variant",
        "manufacturingYear",
        "ownerShip",
        "manufacturingYear",
        "totalDriven",
        "city",
        "state",
      ];

      for (const field of requiredFields) {
        if (data[field] === undefined) {
          throw new BadRequestError(`${field} is a required field.`);
        }
      }
      let ad = await Ad.create({ ...data, user: userId });
      if (!ad)
        throw new BadRequestError("Something Went Wrong. Please try again.");
      this.sendOtpAd(user.email);
      return serviceResponse(
        200,
        { id: ad._id },
        `An Otp for verification has been sent to your email: ${user.email}`
      );
    }
    if (
      subcategory.name === "for rent: house & appartments" ||
      subcategory.name === "for sale: house & appartments"
    ) {
      const requiredFields = [
        "title",
        "description",
        "price",
        "type",
        "furnishing",
        "bedrooms",
        "bathrooms",
        "area",
        "city",
        "occupancy",
        "bachelorAllowed",
        "totalFloor",
        "carParking",
        "facing",
        "construnction",
        "city",
        "state",
        "locality",
      ];
      for (const field of requiredFields) {
        if (data[field] === undefined) {
          throw new BadRequestError(`${field} is a required field.`);
        }
      }
      let ad = await Ad.create({ ...data, user: userId });
      if (!ad)
        throw new BadRequestError("Something Went Wrong. Please try again.");
      this.sendOtpAd(user.email);
      return serviceResponse(
        200,
        { id: ad._id },
        `An Otp for verification has been sent to your email: ${user.email}`
      );
    }
  } else {
    throw new BadRequestError("Category is required");
  }
};

exports.updateAd = async (id, data) => {
  if (data.category) {
    let category = await Category.findById(data.category);
    if (!category) throw new BadRequestError("No such category exists");
    if (!data.subcategory) throw new BadRequestError("Subcategory is required");
    let subcategory = await Subcategory.findOne({
      _id: data.subcategory,
      category: data.category,
    });

    if (!subcategory) throw new BadRequestError("No such subcategory exists");

    if (subcategory.name === "car") {
      const requiredFields = [
        "title",
        "description",
        "price",
        "brand",
        "model",
        "fuel",
        "transmission",
        "variant",
        "manufacturingYear",
        "ownerShip",
        "manufacturingYear",
        "totalDriven",
        "city",
        "state",
      ];

      for (const field of requiredFields) {
        if (data[field] === undefined) {
          throw new BadRequestError(`${field} is a required field.`);
        }
      }

      console.log(
        "This is Id dslkfhjsdhfdjfhdjkhfd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        id
      );
      let ad = await Ad.findByIdAndUpdate(id, { $set: { ...data } });
      if (!ad)
        throw new BadRequestError("Something Went Wrong. Please try again.");

      return serviceResponse(200, {}, "Ad updated successfully");
    }
    if (
      subcategory.name === "for rent: house & appartments" ||
      subcategory.name === "for sale: house & appartments"
    ) {
      const requiredFields = [
        "title",
        "description",
        "price",
        "type",
        "furnishing",
        "bedrooms",
        "bathrooms",
        "area",
        "city",
        "occupancy",
        "bachelorAllowed",
        "totalFloor",
        "carParking",
        "facing",
        "construnction",
        "city",
        "state",
        "locality",
      ];
      for (const field of requiredFields) {
        if (data[field] === undefined) {
          throw new BadRequestError(`${field} is a required field.`);
        }
      }
      let ad = await Ad.findByIdAndUpdate(id, { $set: { ...data } });

      if (!ad)
        throw new BadRequestError("Something Went Wrong. Please try again.");

      return serviceResponse(200, {}, "Ad updated successfully");
    }
  } else {
    throw new BadRequestError("Category is required");
  }
};

exports.deleteAd = async (id, data) => {
  if (!id) throw new BadRequestError("id is required");

  let deletedData = await Ad.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });

  if (!deletedData) throw new BadRequestError("No such Ad exists");
  console.log(deletedData);
  return serviceResponse(200, {}, "Ad deleted successfully");
};

exports.sendOtpAd = async (email) => {
  let data = email.toLocaleLowerCase();
  const [user, otpExists] = await Promise.all([
    User.findOne({ email: data }),
    Otp.findOne({ email: data }),
  ]);

  let otp = generateOTP(6);
  if (otpExists) {
    otpExists.otp = otp;
    await otpExists.save();
  } else {
    await Otp.create({
      email: data,
      otp,
    });
  }

  if (!user)
    throw new NotFoundError(`User with emailId ${data} doesn't exists `);

  let options = {
    email: data,
    message: `Your OTP  for ad verification is : ${otp}`,
    subject: `OTP  for verification`,
  };
  sendEmail(options);

  // Return your successful login response
  return serviceResponse(
    200,
    {},
    `Email containing OTP successfully sent to ${data}`
  );
};

exports.verifyEmailAd = async (data) => {
  let email = data.email.toLocaleLowerCase();
  data.otp;
  const validOtp = await Otp.findOne({
    email,
    otp: data.otp,
  });

  await Otp.deleteOne({
    email,
    otp: data.otp,
  });

  if (!validOtp) throw new BadRequestError("Invalid OTP");

  let ad = await Ad.findByIdAndUpdate(data.id, {
    $set: { isVerifiedByUser: true },
  });
  if (!ad) throw new BadRequestError("Wrong Ad Id");
  return serviceResponse(200, {}, "Email verification successfull");
};
