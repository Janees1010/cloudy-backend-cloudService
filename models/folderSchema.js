const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, // Reference to the parent folder
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who owns this folder,
  sharedWith: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isMovedToBin: { type: Boolean, default: false }, // Specific to this user
        isBinRoot:{type:Boolean, default:false},
        isDeleted: { type: Boolean, default: false } // Specific to this user

      }
    ],
  type:{type:String,default:"folder"},
  isMovedToBin: { type: Boolean, default: false }, // Global flag for owner
  isDeleted: { type: Boolean, default: false }, 
  isBinRoot: {type:Boolean, default:false},
  createdAt: { type: Date, default: Date.now },
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
 