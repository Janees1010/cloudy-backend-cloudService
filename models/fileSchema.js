const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // File name
  size: { type: Number, required: true }, // File size in bytes
  type: { type: String, required: true }, // MIME type
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, // Parent folder reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // File owner
  s3Url: { type: String, required: true }, // URL to access the file in cloud storage
  createdAt: { type: Date, default: Date.now }, // Timestamp for file creation
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
