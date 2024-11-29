const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config();

// Configure the S3 client
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up the multer upload configuration
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'stackup-bucket',
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
    contentType: (req, file, cb) => {
      console.log(file.mimetype,"type");   
      
      cb(null, file.mimetype); // Use file's mimetype
    },
  }),
});


module.exports = { upload };
 