const bcrypt = require("bcrypt");
exports.generateHash = async (string) => {
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
  return await bcrypt.hash(string, salt);
};
