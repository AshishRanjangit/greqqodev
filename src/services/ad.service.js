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
const { CategoryEnum, SubcategoryEnum, Status } = require("../../enums");
const Company = require("../models/adCompanies");
const BikeList = require("../models/bikeList");
const { set } = require("../app");

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
    let user = await User.findById(userId).select("email company");

    let company = await Company.findOne({
      name: { $regex: new RegExp(`^${user.company}$`, "i") },
    });

    if (!company) {
      await Company.create({ name: user.company });
    }

    let category = await Category.findById(data.category).select("name");
    if (!category) throw new BadRequestError("No such category exists");
    if (!data.subcategory) throw new BadRequestError("Subcategory is required");
    let subcategory = await Subcategory.findOne({
      _id: data.subcategory,
      category: data.category,
    });
    if (!subcategory) throw new BadRequestError("No such subcategory exists");
    if (category.name === CategoryEnum.CAR) {
      if (subcategory.name === SubcategoryEnum.CAR) {
        const requiredFields = [
          "title",
          "category",
          "subcategory",
          "description",
          "price",
          "brand",
          "model",
          "fuel",
          "transmission",
          "variant",
          "rtoCity",
          "ownerShip",
          "manufacturingYear",
          "totalDriven",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
    }
    if (category.name === CategoryEnum.ELECTRONICS) {
      if (
        subcategory.name === SubcategoryEnum.LAPTOP ||
        subcategory.name === SubcategoryEnum.COMPUTERACCESSORIES ||
        subcategory.name === SubcategoryEnum.TVSPEAKERS ||
        subcategory.name === SubcategoryEnum.FRIDGE ||
        subcategory.name === SubcategoryEnum.WASHINGMACHINE ||
        subcategory.name === SubcategoryEnum.camera ||
        subcategory.name === SubcategoryEnum.AC ||
        subcategory.name === SubcategoryEnum.OTHERAPPLIANCE
      ) {
        const requiredFields = [
          "title",
          "description",
          "category",
          "subcategory",
          "price",
          "brand",
          "model",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }

        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
    }
    if (category.name === CategoryEnum.MOBILEGADGET) {
      if (
        subcategory.name === SubcategoryEnum.MOBILE ||
        subcategory.name === SubcategoryEnum.WATCH ||
        subcategory.name === SubcategoryEnum.TABLET ||
        subcategory.name === SubcategoryEnum.GAMECONSOLE ||
        subcategory.name === SubcategoryEnum.ACCESSORY
      ) {
        const requiredFields = [
          "title",
          "category",
          "subcategory",
          "description",
          "price",
          "brand",
          "model",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
    }
    if (category.name === CategoryEnum.FURNITURE) {
      if (
        subcategory.name === SubcategoryEnum.CHAIR ||
        subcategory.name === SubcategoryEnum.BED ||
        subcategory.name === SubcategoryEnum.HOMEDECOR ||
        subcategory.name === SubcategoryEnum.OTHERHOUSEHOLD
      ) {
        const requiredFields = [
          "title",
          "description",
          "price",
          "brand",
          "category",
          "subcategory",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
      if (subcategory.name === SubcategoryEnum.SOFA) {
        const requiredFields = [
          "title",
          "description",
          "price",
          "brand",
          "sitting",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
    }
    if (category.name === CategoryEnum.BIKE) {
      if (
        subcategory.name === SubcategoryEnum.MOTORCYCLE ||
        subcategory.name === SubcategoryEnum.SCOOTER
      ) {
        const requiredFields = [
          "title",
          "description",
          "price",
          "brand",
          "category",
          "subcategory",
          "model",
          "fuel",
          "rtoCity",
          "manufacturingYear",
          "ownerShip",
          "totalDriven",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
    }
    if (category.name === CategoryEnum.OTHERVEHICLE) {
      if (subcategory.name === SubcategoryEnum.BYCYCLE) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "brand",
          "model",
          "manufacturingYear",
          "ownerShip",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
      if (subcategory.name === SubcategoryEnum.KIDSVEHICLE) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "brand",
          "model",
          "manufacturingYear",
          "ownerShip",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
    }
    if (category.name === CategoryEnum.REALSTATE) {
      if (
        subcategory.name === SubcategoryEnum.REALSTATERENT ||
        subcategory.name === SubcategoryEnum.REALSTATESALE
      ) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "type",
          "furnishing",
          "bedrooms",
          "bathrooms",
          "area",
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
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
      if (subcategory.name === SubcategoryEnum.PLOT) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "type",
          "length",
          "breadth",
          "area",
          "facing",
          "city",
          "state",
          "locality",
        ];
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
      if (subcategory.name === SubcategoryEnum.LAND) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "type",
          "area",
          "city",
          "facing",
          "city",
          "state",
          "locality",
        ];
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
      if (subcategory.name === SubcategoryEnum.OTHER) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "city",
          "state",
          "locality",
        ];
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        if (data.photos) {
          filteredData.photos = data.photos;
        }
        let ad = await Ad.create({
          ...filteredData,
          user: userId,
          company: user.company,
        });
        if (!ad)
          throw new BadRequestError("Something Went Wrong. Please try again.");
        this.sendOtpAd(user.email);
        return serviceResponse(
          200,
          { id: ad._id },
          `An Otp for verification has been sent to your email: ${user.email}`
        );
      }
    }
  } else {
    throw new BadRequestError("Category is required");
  }
};

exports.updateAd = async (id, data) => {
  if (data.category) {
    let category = await Category.findById(data.category).select("name");
    if (!category) throw new BadRequestError("No such category exists");
    if (!data.subcategory) throw new BadRequestError("Subcategory is required");
    let subcategory = await Subcategory.findOne({
      _id: data.subcategory,
      category: data.category,
    });
    if (!subcategory) throw new BadRequestError("No such subcategory exists");
    if (category.name === CategoryEnum.CAR) {
      if (subcategory.name === SubcategoryEnum.CAR) {
        const requiredFields = [
          "title",
          "description",
          "price",
          "brand",
          "model",
          "fuel",
          "transmission",
          "variant",
          "rtoCity",
          "ownerShip",
          "manufacturingYear",
          "totalDriven",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, { $set: { ...filteredData } });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
    }
    if (category.name === CategoryEnum.ELECTRONICS) {
      if (
        subcategory.name === SubcategoryEnum.LAPTOP ||
        subcategory.name === SubcategoryEnum.COMPUTERACCESSORIES ||
        subcategory.name === SubcategoryEnum.TVSPEAKERS ||
        subcategory.name === SubcategoryEnum.FRIDGE ||
        subcategory.name === SubcategoryEnum.WASHINGMACHINE ||
        subcategory.name === SubcategoryEnum.camera ||
        subcategory.name === SubcategoryEnum.AC ||
        subcategory.name === SubcategoryEnum.OTHERAPPLIANCE
      ) {
        const requiredFields = [
          "title",
          "description",
          "category",
          "subcategory",
          "price",
          "brand",
          "model",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }

        let ad = await Ad.findByIdAndUpdate(id, { $set: { ...filteredData } });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
    }
    if (category.name === CategoryEnum.MOBILEGADGET) {
      if (
        subcategory.name === SubcategoryEnum.MOBILE ||
        subcategory.name === SubcategoryEnum.WATCH ||
        subcategory.name === SubcategoryEnum.TABLET ||
        subcategory.name === SubcategoryEnum.GAMECONSOLE ||
        subcategory.name === SubcategoryEnum.ACCESSORY
      ) {
        const requiredFields = [
          "title",
          "category",
          "subcategory",
          "description",
          "price",
          "brand",
          "model",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, { $set: { ...filteredData } });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
    }
    if (category.name === CategoryEnum.FURNITURE) {
      if (
        subcategory.name === SubcategoryEnum.CHAIR ||
        subcategory.name === SubcategoryEnum.BED ||
        subcategory.name === SubcategoryEnum.HOMEDECOR ||
        subcategory.name === SubcategoryEnum.OTHERHOUSEHOLD
      ) {
        const requiredFields = [
          "title",
          "description",
          "price",
          "brand",
          "category",
          "subcategory",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, { $set: { ...filteredData } });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
      if (subcategory.name === SubcategoryEnum.SOFA) {
        const requiredFields = [
          "title",
          "description",
          "price",
          "brand",
          "sitting",
          "purchasedYear",
          "condition",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }

        let ad = await Ad.findByIdAndUpdate(id, { $set: { ...filteredData } });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
    }
    if (category.name === CategoryEnum.BIKE) {
      if (
        subcategory.name === SubcategoryEnum.MOTORCYCLE ||
        subcategory.name === SubcategoryEnum.SCOOTER
      ) {
        const requiredFields = [
          "title",
          "description",
          "price",
          "brand",
          "category",
          "subcategory",
          "model",
          "fuel",
          "rtoCity",
          "manufacturingYear",
          "ownerShip",
          "totalDriven",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, {
          $set: { ...filteredData },
        });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
    }
    if (category.name === CategoryEnum.OTHERVEHICLE) {
      if (subcategory.name === SubcategoryEnum.BYCYCLE) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "brand",
          "model",
          "manufacturingYear",
          "ownerShip",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, {
          $set: { ...filteredData },
        });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
      if (subcategory.name === SubcategoryEnum.KIDSVEHICLE) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "brand",
          "model",
          "manufacturingYear",
          "ownerShip",
          "city",
          "state",
        ];

        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, {
          $set: { ...filteredData },
        });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
    }
    if (category.name === CategoryEnum.REALSTATE) {
      if (
        subcategory.name === SubcategoryEnum.REALSTATERENT ||
        subcategory.name === SubcategoryEnum.REALSTATESALE
      ) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "type",
          "furnishing",
          "bedrooms",
          "bathrooms",
          "area",
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
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, {
          $set: { ...filteredData },
        });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
      if (subcategory.name === SubcategoryEnum.PLOT) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "type",
          "length",
          "breadth",
          "area",
          "facing",
          "city",
          "state",
          "locality",
        ];
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, {
          $set: { ...filteredData },
        });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
      if (subcategory.name === SubcategoryEnum.LAND) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "type",
          "area",
          "city",
          "facing",
          "city",
          "state",
          "locality",
        ];
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, {
          $set: { ...filteredData },
        });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
      if (subcategory.name === SubcategoryEnum.OTHER) {
        const requiredFields = [
          "category",
          "subcategory",
          "title",
          "description",
          "price",
          "city",
          "state",
          "locality",
        ];
        const filteredData = {};
        for (const field of requiredFields) {
          if (data[field] === undefined) {
            throw new BadRequestError(`${field} is a required field.`);
          }
          filteredData[field] = data[field];
        }
        let ad = await Ad.findByIdAndUpdate(id, {
          $set: { ...filteredData },
        });
        if (!ad) throw new BadRequestError("Wrong Ad Id");
        return serviceResponse(200, {}, `Ad updated successfully`);
      }
    }
  } else {
    throw new BadRequestError("Category is required");
  }
};

exports.changeAdStatus = async (id, data) => {
  if (!id) throw new BadRequestError("id is required");

  let ad = await Ad.findById(id).select("isActive");
  if (!ad) {
    throw new BadRequestError("No such ad exists with this Id");
  }
  let status;
  ad.isActive ? (status = false) : (status = true);

  ad.isActive = status;
  await ad.save();

  return serviceResponse(200, {}, "Ad status updated successfully");
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
  if (queryData.state) query.state = { $regex: queryData.state, $options: "i" };
  if (queryData.locality)
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
        "title description model createdAt isActive category subcategory status price locality brand fuel transmission photos construnction occupancy listedBy enquiryCount"
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
  // query.status = Status.VERIFIED;
  query.isDeleted = false;
  query.isActive = true;
  if (queryData.status) query.status = queryData.status;
  if (queryData.company) query.company = queryData.company;
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
          "title description createdAt company category subcategory status price locality brand fuel transmission photos construnction occupancy listedBy enquiryCount"
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
          "title description createdAt model category company subcategory status price locality brand fuel transmission photos construnction occupancy listedBy enquiryCount"
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

exports.getBikeBrands = async () => {
  const brands = await BikeList.find({}).select("brand").limit(Infinity).lean();
  const uniqueBrands = [...new Set(brands.map((item) => item.brand))];
  uniqueBrands.sort();
  return serviceResponse(
    200,
    { uniqueBrands },
    "Bike brands fetched succefully"
  );
};

exports.getBikeModels = async (brand) => {
  const models = await BikeList.find({ brand })
    .select("model")
    .limit(Infinity)
    .lean();
  const uniqueModels = [...new Set(models.map((item) => item.model))];
  uniqueModels.sort();
  return serviceResponse(
    200,
    { uniqueModels },
    "Bike models fetched succefully"
  );
};

exports.getCompanies = async () => {
  const company = await Company.find({})
    .sort({ name: -1 })
    .select("name")
    .lean();
  return serviceResponse(200, { company }, "Comapanies fetched successfully");
};
