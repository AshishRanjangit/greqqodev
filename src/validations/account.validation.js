const { body, query } = require("express-validator");

const checkSmallCase = /^(?=.*[a-z])$/;
const checkUpperCase = /^(?=.*[A-Z])$/;
const checkNumberCase = /^(?=.*\d)$/;
const checkSpecialCharacterCase = /^(?=.*[@$!%*?&])$/;

exports.resendOtpValidation = [
  body("userId").trim().isMongoId().withMessage("Please enter a valid userId"),
];
exports.emailValidation = [
  body("email").trim().isEmail().withMessage("Enter a valid email"),
];

exports.signInValidator = [
  body("email").trim().isEmail().withMessage("Please enter a valid email Id"),

  (req, res, next) => {
    const password = req.body.password;
    const otp = req.body.otp;

    if (!password && !otp) {
      return res.status(400).json({ error: "Please enter password or otp" });
    }
    next();
  },

  // Validation for "otp" field
  body("otp")
    .optional()
    .isNumeric()
    .withMessage("OTP must be a number")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

exports.emailOtpValidator = [
  body("email").trim().isEmail().withMessage("Please enter a valid email Id"),
  body("otp")
    .isNumeric()
    .withMessage("OTP must be a number")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

exports.signupValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email Id"),

  body("userName").trim().notEmpty().withMessage("userName is required"),
  body("phoneNumber")
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be of 10 digits"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password should be of atleast 8 characters ")

    .isLength({ max: 20 })
    .withMessage("Password cannot 20 characters "),
  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one of the special symbols @$!%*?#"
    ),
  body("company")
    .optional()
    .isString()
    .withMessage("EmployeeId must be a string"),
];

exports.updateUserValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email Id"),

  body("userName").trim().notEmpty().withMessage("userName is required"),
  body("phoneNumber")
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be of 10 digits"),
  body("company")
    .optional()
    .isString()
    .withMessage("EmployeeId must be a string"),
  body("profilePicture")
    .optional()
    .isString()
    .withMessage("profilePicture  must be a string Url"),
  body("city").optional().isString().withMessage("city  must be a string."),
  body("state").optional().isString().withMessage("state  must be a string"),
  body("pincode")
    .optional()
    .isNumeric()
    .withMessage("pincode  must be a number")
    .isLength({ min: 6, max: 6 })
    .withMessage("pincode must be of 6 digits"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .if((value, { req }) => req.body.tags)
    .custom((tags, { req }) => {
      // Check if all elements in the array are strings
      if (!tags.every((tag) => typeof tag === "string")) {
        throw new Error("Each tag must be a string");
      }
      return true;
    }),
];
