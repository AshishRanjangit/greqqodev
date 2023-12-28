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

exports.getAllAdsUser = async (queryData, userId) => {
  const query = {};
  query.isBlocked = false;
  query.isDeleted = false;
  query.user = userId;
  if (queryData.status) query.status = queryData.status;
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

exports.getAllAds = async (queryData, isloggedIn) => {
  const query = {};

  query.isVerifiedByUser = true;
  query.isBlocked = false;
  query.isDeleted = false;
  if (queryData.status) query.status = queryData.status;
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

  if (isloggedIn) {
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
  } else {
    const [ads, adsCount] = await Promise.all([
      Ad.find(query)
        .populate("user", " state city address pincode  ")
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
  }
};

exports.getAd = async (id, isloggedIn) => {
  if (isloggedIn) {
    const ad = await Ad.findById(id)
      .populate(
        "user",
        "userName email  phoneNumber  company state city address pincode"
      )
      .populate("category", "name")
      .populate("subcategory", "name")
      .select("-isActive -isDeleted -isVerifiedByUser -__v");

    return serviceResponse(200, { ad }, "Ad fetched succefully");
  } else {
    const ad = await Ad.findById(id)
      .populate("user", " state city address pincode")
      .populate("category", "name")
      .populate("subcategory", "name")
      .select("-isActive -isDeleted -isVerifiedByUser -__v");

    return serviceResponse(200, { ad }, "Ad fetched succefully");
  }
};
