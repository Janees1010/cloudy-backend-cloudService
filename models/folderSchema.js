const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, // Reference to the parent folder
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who owns this folder
  createdAt: { type: Date, default: Date.now },
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
