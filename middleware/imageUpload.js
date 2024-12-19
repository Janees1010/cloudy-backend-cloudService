// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const multer = require("multer")
// require('dotenv').config();

// // Configure the S3 client
// const s3Client = new S3Client({
//   region: "ap-south-1", 
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const upload = multer({ storage: multer.memoryStorage() }); 
// module.exports = { upload };

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define the destination folder or memoryStorage if you want to store files in memory
module.exports = { upload };

 
// Middleware to generate pre-signed URLs instead of uploading files
// const generatePresignedUrls = async (req, res, next) => {
//   try {
//     // Ensure that the client is sending file metadata (e.g., file names, mime types)
//     const files = req.body.files; // Array of file metadata sent from the client (not actual files)
//     console.log(files);
    
//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: 'No files provided' });
//     }

//     const presignedUrls = [];

//     // Generate pre-signed URL for each file based on metadata
//     for (const file of files) {
//       const params = {
//         Bucket: 'stackup-bucket', // Your S3 bucket name
//         Key: `uploads/${Date.now()}-${file.name}`, // Unique key for each file
//         Expires: 60 * 10, // URL expiration time in seconds (10 minutes)
//         ContentType: file.mimeType, // File content type (from client)
//       };

//       // Generate the pre-signed URL for file upload
//       const command = new PutObjectCommand(params);
//       const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 10 });

//       // Add file details and its pre-signed URL to the response array
//       presignedUrls.push({
//         fileName: file.name,
//         uploadUrl: url,  // The pre-signed URL
//       });
//     }

//     // Attach the generated pre-signed URLs to the request object for use in the controller
//     req.presignedUrls = presignedUrls;

//     // Call next middleware or controller
//     return res.json({ presignedUrls: req.presignedUrls });
//   } catch (error) {
//     console.error('Error generating pre-signed URLs:', error);
//     return res.status(500).json({ message: 'Error generating pre-signed URLs' });
//   }
// };


