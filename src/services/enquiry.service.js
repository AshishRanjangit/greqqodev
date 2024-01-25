const { BadRequestError, NotFoundError } = require("../errors");
const { serviceResponse } = require("../utils/serviceResponse");
const Category = require("../models/category");
const Ad = require("../models/ad");
const User = require("../models/user");
const { CategoryEnum, SubcategoryEnum, Status } = require("../../enums");
const Company = require("../models/adCompanies");
const Enquiry = require("../models/adEnquiry");

exports.postEnquiry = async (userId, adId) => {
  const ad = await Ad.findById(adId).select("user _id enquiryCount");
  if (!ad) {
    throw new BadRequestError("No ad with this Id found");
  }
  if (String(userId) !== String(ad.user)) {
    let enquiry = await Enquiry.findOne({
      ad: ad._id,
      enquiryUser: userId,
    });
    if (!enquiry) {
      await Enquiry.create({ user: ad.user, ad: ad._id, enquiryUser: userId });
      if (!ad.enquiryCount) {
        ad.enquiryCount = 1;
      } else {
        ad.enquiryCount++;
      }
      await ad.save();
    }
  }
  return serviceResponse(200, {}, "Enquiry Added succefully");
};

exports.getEnquiriesBuyer = async (userId, queryData) => {
  let query = {};
  query.enquiryUser = userId;
  if (queryData.keyword) {
    query["$or"] = [
      {
        user: {
          $in: await User.find({
            $or: [
              { phoneNumber: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for phoneNumber
              { email: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
              { company: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
            ],
          }).distinct("_id"),
        },
      },
      {
        ad: {
          $in: await Ad.find({
            $or: [
              { title: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for phoneNumber
              { description: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
              { company: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
            ],
          }).distinct("_id"),
        },
      },
    ];
  }

  if (queryData.status) {
    query.status = queryData.status;
  }

  const [enquiry, enquiryCount] = await Promise.all([
    Enquiry.find(query)
      .select("user ad status createdAt")
      .populate(
        "user",
        "userName email phoneNumber company city state address pincode profilePicture"
      )
      .populate("ad", "title description price photos")
      .sort({ createdAt: -1 })
      .limit(queryData.limit)
      .skip(queryData.limit * (queryData.page - 1)),
    Enquiry.countDocuments(query),
  ]);

  return serviceResponse(
    200,
    { enquiry, enquiryCount: enquiryCount },
    "Enquiries fetched successfully"
  );
};

exports.getEnquiriesSeller = async (userId, queryData) => {
  let query = {};
  query.user = userId;
  if (queryData.keyword) {
    query["$or"] = [
      {
        enquiryUser: {
          $in: await User.find({
            $or: [
              { phoneNumber: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for phoneNumber
              { email: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
              { company: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
            ],
          }).distinct("_id"),
        },
      },
      {
        ad: {
          $in: await Ad.find({
            $or: [
              { title: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for phoneNumber
              { description: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
              { company: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
            ],
          }).distinct("_id"),
        },
      },
    ];
  }
  if (queryData.status) {
    query.status = queryData.status;
  }
  const [enquiry, enquiryCount] = await Promise.all([
    Enquiry.find(query)
      .select("enquiryUser ad status createdAt")
      .populate(
        "enquiryUser",
        "userName email phoneNumber company city state address pincode profilePicture"
      )
      .populate("ad", "title description price photos")
      .sort({ createdAt: -1 })
      .limit(queryData.limit)
      .skip(queryData.limit * (queryData.page - 1)),
    Enquiry.countDocuments(query),
  ]);

  return serviceResponse(
    200,
    { enquiry, enquiryCount: enquiryCount },
    "Enquiries for seller fetched successfully"
  );
};

exports.getEnquiriesOnAd = async (userId, adId, queryData) => {
  let query = {};
  query.user = userId;
  query.ad = adId;
  if (queryData.keyword) {
    query["$or"] = [
      {
        enquiryUser: {
          $in: await User.find({
            $or: [
              { phoneNumber: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for phoneNumber
              { email: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
              { company: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
            ],
          }).distinct("_id"),
        },
      },
      {
        ad: {
          $in: await Ad.find({
            $or: [
              { title: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for phoneNumber
              { description: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
              { company: { $regex: queryData.keyword, $options: "i" } }, // Case-insensitive regex match for email
            ],
          }).distinct("_id"),
        },
      },
    ];
  }

  if (queryData.status) {
    query.status = queryData.status;
  }

  const [enquiry, enquiryCount] = await Promise.all([
    Enquiry.find(query)
      .select("enquiryUser ad status createdAt")
      .populate(
        "enquiryUser",
        "userName email phoneNumber company city state address pincode profilePicture"
      )
      .populate("ad", "title description price photos")
      .sort({ createdAt: -1 })
      .limit(queryData.limit)
      .skip(queryData.limit * (queryData.page - 1)),
    Enquiry.countDocuments(query),
  ]);

  return serviceResponse(
    200,
    { enquiry, enquiryCount: enquiryCount },
    "Enquiries for seller fetched successfully"
  );
};

exports.updateEnquiryStatus = async (userId, enquiryId, status) => {
  let query = {};
  query.enquiryUser = userId;
  query._id = enquiryId;

  let enquiry = await Enquiry.findOne(query);

  if (!enquiry)
    throw new BadRequestError("No such enquiry with this Id exists");

  if (!status) throw new BadRequestError("Status is required");
  enquiry.status = status;

  await enquiry.save();

  return serviceResponse(200, {}, "Status updated successfully");
};

exports.deleteEnquiry = async (userId, enquiryId) => {
  let query = {};
  query.enquiryUser = userId;
  query._id = enquiryId;

  const enquiry = await Enquiry.findOne(query);
  if (!enquiry)
    throw new BadRequestError("No such enquiry with this Id exists");

  const ad = await Ad.findById(enquiry.ad);

  ad.enquiryCount--;

  await Promise.all([ad.save(), Enquiry.findByIdAndDelete(enquiryId)]);

  return serviceResponse(200, {}, "Enquiry removed successfully");
};
