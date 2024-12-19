const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  size: { type: Number, required: true }, 
  type: { type: String, required: false }, 
  sharedWith: [ 
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isMovedToBin: { type: Boolean, default: false }, // Specific to this user
      isDeleted: { type: Boolean, default: false },
      lastAccessed: { type: Date, default: Date.now },// Timestamp for file creation
      // Specific to this user
    }
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, // Parent folder reference
  s3Url: { type: String, required: true }, // URL to access the file in cloud storage
  isMovedToBin: { type: Boolean, default: false }, // Global flag for owner
  isDeleted: { type: Boolean, default: false },
  isBinRoot:{type:Boolean, default:false},
  lastAccessed: { type: Date, default: Date.now },// Timestamp for file creation
  createdAt: { type: Date, default: Date.now },
});


const File = mongoose.model('File', fileSchema);
module.exports = File;  
