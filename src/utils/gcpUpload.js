const { Storage } = require("@google-cloud/storage");

const GCS_TYPE = process.env.GCS_TYPE,
  GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME,
  GCS_PROJECT_ID = process.env.GCS_PROJECT_ID,
  GCS_CLIENT_EMAIL = process.env.GCS_CLIENT_EMAIL,
  GCS_PRIVATE_KEY = process.env.GCS_PRIVATE_KEY,
  GCS_PRIVATE_KEY_ID = process.env.GCS_PRIVATE_KEY_ID,
  GCS_CLIENT_ID = process.env.GCS_CLIENT_ID,
  GCS_AUTH_URI = process.env.GCS_AUTH_URI,
  GCS_TOKEN_URI = process.env.GCS_TOKEN_URI,
  GCS_AUTH_PROVIDER_X509_CERT_URL = process.env.GCS_AUTH_PROVIDER_X509_CERT_URL,
  GCS_CLIENT_X509_CERT_URL = process.env.GCS_CLIENT_X509_CERT_URL,
  GCS_UNIVERSE_DOMAIN = process.env.GCS_UNIVERSE_DOMAIN,
  GCS_BASE_STORAGE_URL = process.env.GCS_BASE_STORAGE_URL;

const storage = new Storage({
  projectId: GCS_PROJECT_ID,
  credentials: {
    type: GCS_TYPE,
    project_id: GCS_PROJECT_ID,
    private_key_id: GCS_PRIVATE_KEY_ID,
    private_key: GCS_PRIVATE_KEY,
    client_email: GCS_CLIENT_EMAIL,
    client_id: GCS_CLIENT_ID,
    auth_uri: GCS_AUTH_URI,
    token_uri: GCS_TOKEN_URI,
    universe_domain: GCS_UNIVERSE_DOMAIN,
    client_x509_cert_url: GCS_CLIENT_X509_CERT_URL,
    auth_provider_x509_cert_url: GCS_AUTH_PROVIDER_X509_CERT_URL,
  },
});

const bucket = storage.bucket(GCS_BUCKET_NAME);

const uploadToGCS = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const filename = Date.now() + "_" + file.originalname;
      const blob = bucket.file(filename.replace(/ /g, "_"));
      const blobStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      // ending stream
      blobStream.end(file.buffer);

      blobStream.on("error", (err) => {
        console.log(
          `GCS Stream Error/file:${filename}/ ${JSON.stringify(err)}`
        );
      });

      blobStream.on("finish", async () => {
        const publicUrl = `${GCS_BASE_STORAGE_URL}/${GCS_BUCKET_NAME}/${blob.name}`;

        // log
        console.log(`File uploaded successfully!`);

        // to make image publically readable
        await storage
          .bucket(GCS_BUCKET_NAME)
          .file(filename)
          .makePublic()
          .then((data, err) => {
            if (err) {
              resolve({
                code: 207,
                message: `File uploaded successfully but couldn't made public`,
                data: publicUrl,
              });
            }
            console.log(
              `File uploaded successfully and made public ${JSON.stringify(
                data
              )}`
            );
          });

        resolve({
          code: 200,
          message: `File uploaded successfully!`,
          data: publicUrl,
        });
      });
    } catch (err) {
      console.log(
        `Error at GCP Storage ${payload.file.originalname}/\n${JSON.stringify(
          err
        )}`
      );
      resolve({
        code: 500,
        message: `Could not upload the file: ${payload.file.originalname}/ ${err.message}`,
      });
    }
  });
};

module.exports = { uploadToGCS };
