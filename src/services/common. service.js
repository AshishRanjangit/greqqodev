const { serviceResponse } = require("../utils/serviceResponse");
const cloudinary = require("cloudinary");

exports.uploadFile = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadResult = await new Promise((resolve) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          resolve(null); // Resolve with null to indicate an error
        } else {
          resolve(result);
        }
      }
    );

    // Pipe the file buffer to the upload stream
    uploadStream.end(file.buffer);
  });

  console.log("Upload Result:", uploadResult);

  if (uploadResult) {
    return serviceResponse(
      200,
      { imageUrl: uploadResult.url },
      "Image uploaded successfully"
    );
  } else {
    return serviceResponse(500, {}, "Error uploading image to Cloudinary");
  }
};
