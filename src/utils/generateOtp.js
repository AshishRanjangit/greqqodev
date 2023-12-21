const  otp=require("otp-generator");
exports.generateOTP = (length) => {
  let code = Number(
    otp.generate(length, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
  );
  return code;
};

