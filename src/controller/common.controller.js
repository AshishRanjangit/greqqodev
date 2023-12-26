const commonService = require("../services/common. service");
const { sendResponse } = require("../utils/sendResponse");

exports.uploadFile = async (req, res) => {
  const file = req.file;
  const response = await commonService.uploadFile(file);
  const { statusCode, data, message } = response;
  return sendResponse(res, statusCode, data, message);
};

// (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   // Upload file to Cloudinary
//   cloudinary.uploader
//     .upload_stream({ resource_type: "auto" }, (error, result) => {
//       if (error) {
//         return res.status(500).send("Error uploading file to Cloudinary.");
//       }

//       // Process the Cloudinary result (save to database, etc.)
//       console.log("Cloudinary result:", result);

//       // Send the URL as the response
//       res.send(result.url);
//     })
//     .end(req.file.buffer);
// };
