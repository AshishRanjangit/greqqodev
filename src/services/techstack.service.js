const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { serviceResponse } = require("../utils/serviceResponse");
const Techstack = require("../models/techStack");

exports.getTeckStack = async () => {
  const techStack = await Techstack.find({ isActive: true }).select("name");

  return serviceResponse(
    200,
    {
      techStack,
    },
    "Successfully created succesfully"
  );
};
