const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Otp = require("../models/otp");
const { generateToken } = require("../utils/jwt");
const { serviceResponse } = require("../utils/serviceResponse");
const { generateOTP } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/sendMail");
const crypto = require("crypto");
const { promises } = require("nodemailer/lib/xoauth2");
const { emailDomain } = require("../../enums");

exports.sendEmailVerificationOtp = async (email) => {
  let data = email.toLocaleLowerCase();
  const [user, otpExists] = await Promise.all([
    User.findOne({ email: data }),
    Otp.findOne({ email: data }),
  ]);

  console.log("user>>>>>>>>>>>", user);

  if (user.isEmailVerified === true)
    throw new BadRequestError("User email is already verified");

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
    message: `Your OTP  for email verification is : ${otp}`,
    subject: `OTP  Email Verification`,
  };
  sendEmail(options);

  // Return your successful login response
  return serviceResponse(
    200,
    {},
    `Email containing OTP for email verification sent succesfully to ${data}`
  );
};

exports.signIn = async (data) => {
  const user = await User.findOne({
    email: data.email.toLocaleLowerCase(),
  });

  if (!user)
    throw new NotFoundError(
      `User with email ${data.email.toLocaleLowerCase()} not found`
    );

  if (user.isEmailVerified === false) {
    let response = await this.sendEmailVerificationOtp(data.email);
    return response;
  }
  let accessToken;

  if (data.password) {
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new BadRequestError("Wrong password");
    }
    accessToken = await generateToken(user);
    return serviceResponse(
      200,
      {
        user: {
          ...user.toObject(),
          password: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          role: undefined,
          isEmailVerified: undefined,
          __v: undefined,
        },
        accessToken,
      },
      "Successfully signed in"
    );
  } else if (data.otp) {
    const validOtp = await Otp.findOne({
      email: data.email,
      otp: data.otp,
    });

    await Otp.deleteOne({
      email: data.email,
      otp: data.otp,
    });

    if (!validOtp) throw new BadRequestError("Invalid OTP");

    accessToken = await generateToken(user);

    return serviceResponse(
      200,
      {
        user: {
          ...user.toObject(),
          password: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          __v: undefined,
        },
        accessToken,
      },
      "Successfully signed in"
    );
  }
};

exports.verifyEmail = async (data) => {
  let email = data.email.toLocaleLowerCase();
  let user = await User.findOne({
    email,
  });
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

  user.isEmailVerified = true;

  [accessToken, user] = await Promise.all([generateToken(user), user.save()]);
  return serviceResponse(
    200,
    {
      user: {
        ...user.toObject(),
        password: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        role: undefined,
        isEmailVerified: undefined,
        __v: undefined,
      },
      accessToken,
    },
    "Email verification successfull user loggedIn"
  );
};

exports.signUp = async (userData) => {
  if (emailDomain.includes(userData.email.split("@")[1].toLocaleLowerCase())) {
    throw new BadRequestError(
      "Only domain associated with a company is allowed"
    );
  }
  const user = await User.create({
    ...userData,
    email: userData.email.toLocaleLowerCase(),
    userName: userData.userName.toLocaleLowerCase(),
  });

  let response = await this.sendEmailVerificationOtp(userData.email);
  return response;
};

exports.sendOtp = async (email) => {
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
    message: `Your OTP  for login is : ${otp}`,
    subject: `OTP  for login`,
  };
  sendEmail(options);

  // Return your successful login response
  return serviceResponse(
    200,
    {},
    `Email containing OTP successfully sent to ${data}`
  );
};

exports.getUser = async (userId) => {
  let user = await User.findById(userId).select(
    "-password -role -isActive -createdAt -updatedAt -isEmailVerified -__v"
  );

  if (!user) throw new NotFoundError(`User with id doesn't exists `);

  // Return your successful login response
  return serviceResponse(200, { user }, `User details fetched`);
};

exports.updateUser = async (userId, userData) => {
  if (emailDomain.includes(userData.email.split("@")[1].toLocaleLowerCase())) {
    throw new BadRequestError(
      "Only domain associated with a company is allowed"
    );
  }
  let user = await User.findByIdAndUpdate(userId, { $set: userData });
  if (!user) throw new NotFoundError(`User with id doesn't exists `);

  // Return your successful login response
  return serviceResponse(200, {}, `User details updated`);
};

exports.forgetPassword = async (email) => {
  let data = email.toLocaleLowerCase();
  const user = await User.findOne({ email: data }).select(
    "firstName lastName resetToken resetTokenExpiration role"
  );

  if (!user) throw new BadRequestError("No user With this email found");

  // Generate a unique reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

  user.resetToken = resetToken;
  user.resetTokenExpiration = resetTokenExpiration;
  await user.save();

  let tokenUrl = `${process.env.FE_BASE_URL}/reset/${resetToken}`;

  let options = {
    email: data,
    message: `Please click on the link reset your password ${tokenUrl}`,
    subject: `Reset password`,
  };
  sendEmail(options);

  return serviceResponse(
    200,
    {},
    `An email containing reset password link has been sent to ${data}`
  );
};

exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  }).select("-createdAt -updateAt -__v");

  if (!user) throw new BadRequestError("Invalid or expired token");
  user.password = newPassword;
  // Clear the reset token fields in the database
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();
  return serviceResponse(200, {}, "Password reset successful. Please login.");
};
