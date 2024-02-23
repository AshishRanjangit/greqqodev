const { BadRequestError } = require("../errors");
const sharp = require("sharp");

exports.imageValidatorMiddleware = (req, res, next) => {
  // Check if the file is an image based on mimetype
  if (req.file && req.file.mimetype.startsWith("image/")) {
    // If it's an image, proceed to the next middleware or route handler
    next();
  } else {
    // If it's not an image, send an error response
    throw new BadRequestError("File is not an image");
  }
};

exports.compressImageMiddleware = (req, res, next) => {
  // Check if there is a file in the request
  if (!req.file) {
    return next();
  }

  // Use sharp to compress the image without specifying the format
  sharp(req.file.buffer)
    .jpeg({ quality: 30 }) // You can customize compression options based on your requirements
    .toBuffer()
    .then((compressedBuffer) => {
      // Replace the original buffer with the compressed one
      req.file.buffer = compressedBuffer;
      next();
    })
    .catch((error) => {
      console.error("Error compressing image:", error);
      next(error);
    });
};
