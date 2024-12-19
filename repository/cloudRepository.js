const Folder = require("../models/folderSchema");
const File = require("../models/fileSchema");
const mongoose = require("mongoose");

// const findOneFolder = async(name,userId)=>{
//     try {
//         const folder = await Folder.findOne({name,userId})
//         return folder
//     } catch (error) {
//         throw new Error("error finding folder " + error.message)
//     }
// }

const createFolder = async (data) => {
  const { name, parentId, userId } = data;
  if ((!name || !parentId, !userId))
    throw new Error("credentials for creating folder are missing");
  parentId === "null" ? (parentId = null) : parentId;
  try {
    const folder = await Folder.create({
      name,
      parentId,
      owner: userId,
    });
    return folder;
  } catch (error) {
    throw new Error("error inserting folder" + error.message);
  }
};

const findLatestFolderandFile = async()=>{
   try {
       const folders =  await Folder.find({$or:[
        {
          owner:userId,
          isDeleted:false,
          isMovedToBin:false
        },
        {
          sharedWith:{
            $elemMatch:{
              userId,
              isMovedToBin:false,
              isDeleted:false
            }
          }
        }
       ]}).sort({_id:-1}).limit(8)
       const files = await File.find({$or:[
        {
          owner:userId,
          isDeleted:false,
          isMovedToBin:false
        },
        {
          sharedWith:{
            $elemMatch:{
              userId,
              isMovedToBin:false,
              isDeleted:false
            }
          }
        }
       ]}).sort({_id:-1}).limit(8)
       return [folders,files]
   } catch (error) {
      throw new Error(`error while fetching latest folders:${error.message}`)
   }
}

const createFile = async (fileData) => {
  try {
    const file = await File.create(fileData);
    return file;
  } catch (error) {
    throw new Error("error wfile creating file" + error.message);
  }
};

const findFolderChilds = async (data) => {
  try {
    let { userId, parentId, type } = data;

    if (!userId)
      throw new Error("Credentials for finding children are missing");

    parentId =
      parentId === "null"
        ? null
        : parentId
        ? new mongoose.Types.ObjectId(parentId)
        : null;

    // Fetch files
    let query;
    if (type === "drive") {
      query = {
        parentId,
        owner: userId,
        isMovedToBin: false,
        isDeleted: false,
      };
    } else if (type === "shared") {
      query = {
        parentId,
        $or: [
          // { owner: userId, isMovedToBin: false, isDeleted: false },
          {
            sharedWith: {
              $elemMatch: {
                userId: userId,
                isMovedToBin: false,
                isDeleted: false,
              },
            },
          },
        ],
      };
    }

    const files = await File.find(query);
    const folders = await Folder.find(query);
    // Combine results
    const childrens = folders.concat(files);
    return childrens;
  } catch (error) {
    console.error("Error while fetching folder children:", error);
    throw new Error(`Error while fetching folder children: ${error.message}`);
  }
};

const findFolder = async (data) => {
  try {
    const { userId, name = null, parentId = null } = data;
    if (name) {
      const folder = await Folder.findOne({
        parentId,
        name,
        $or: [
          {
            owner: userId,
            isMovedToBin: false,
            isDeleted: false,
          },
          {
            sharedWith: {
              $elemMatch: {
                userId,
                isMovedToBin: false,
                isDeleted: false,
              },
            },
          },
        ],
      });
      return folder;
    } else {
      console.log("this is needed repository 89");
      console.log(parentId);
      const folder = await Folder.findOne({
        _id: parentId,
        $or: [
          {
            owner: userId,
            isMovedToBin: false,
            isDeleted: false,
          },
          {
            sharedWith: {
              $elemMatch: {
                userId,
                isMovedToBin: false,
                isDeleted: false,
              },
            },
          },
        ],
      });
      return folder;
    }
  } catch (error) {
    throw new Error(`error while fetching folder : ${error.message}`);
  }
};

const getRecentFiles = async (userId) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0)); // Midnight today
    const startOfLastWeek = new Date(startOfToday);
    startOfLastWeek.setDate(startOfToday.getDate() - 7);
    const startOfLastMonth = new Date(startOfToday);
    startOfLastMonth.setDate(startOfToday.getDate() - 30);

    // Single database query for all relevant files
    const files = await File.find({
      lastAccessed: { $gte: startOfLastMonth },
      $or: [
        {
          owner: userId,
          isMovedToBin: false,
          isDeleted: false,
        },
        {
          sharedWith: {
            $elemMatch: { userId, isMovedToBin: false, isDeleted: false },
          },
        },
      ],
      // Fetch files accessed in the last month and older
    }).sort({ lastAccessed: -1 });

    // Categorize files in application logic
    const recentFiles = {
      today: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    };

    files.forEach((file) => {
      if (file.lastAccessed >= startOfToday) {
        recentFiles.today.push(file);
      } else if (file.lastAccessed >= startOfLastWeek) {
        recentFiles.lastWeek.push(file);
      } else if (file.lastAccessed >= startOfLastMonth) {
        recentFiles.lastMonth.push(file);
      } else {
        recentFiles.older.push(file);
      }
    });
    console.log(recentFiles, "recent");
    return recentFiles;
  } catch (error) {
    throw new Error(`Error fetching recent files: ${error.message}`);
  }
};

const updateLastAccesssed = async (data) => {
  try {
    const { userId, fileId } = data;

    // Check if the user is the owner
    const isOwner = await File.exists({ _id: fileId, owner: userId });

    if (isOwner) {
      // Update root-level lastAccessed if the user is the owner
      const response = await File.updateOne(
        { _id: fileId },
        { $set: { lastAccessed: new Date() } }
      );
      return response;
    } else {
      // Update sharedWith array lastAccessed for the matching userId
      const response = await File.updateOne(
        { _id: fileId, "sharedWith.userId": userId },
        { $set: { "sharedWith.$.lastAccessed": new Date() } }
      );
      return response;
    }
  } catch (error) {
    throw new Error("Error while updating last accessed: " + error.message);
  }
};

const findFilesStorage = async (userId) => {
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  try {
    const files = await File.aggregate([
      {
        $match: {
          $or: [
            { owner: userIdObjectId, isMovedToBin: false, isDeleted: false },
            {
              sharedWith: {
                $elemMatch: {
                  userId: userIdObjectId,
                  isMovedToBin: false,
                  isDeleted: false,
                },
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$userId",
          totalStorage: {
            $sum: "$size",
          },
          files: {
            $push: "$$ROOT", // Push the entire document into the `files` array.
          },
        },
      },
      {
        $project: {
          files: 1,
          totalStorage: 1,
          _id: 0,
        },
      },
    ]);
    console.log(files);
    return files;
  } catch (error) {
    throw new Error(
      `Error while fetching totol storage of file : ${error.message}`
    );
  }
};

let isBinRoot = false;
const moveToBin = async (id, type, name) => {
  try {
    if (type === "folder") {
      id = id === "null" ? null : id;
      console.log(id, "parentId");
      // Move the folder to bin
      let folderResponse;
      if (!isBinRoot) {
        folderResponse = await Folder.findOneAndUpdate(  
          { _id: id, name },
          { isMovedToBin: true, isBinRoot: true }
        );
      } else {
        folderResponse = await Folder.findOneAndUpdate(
          { _id: id, name },
          { isMovedToBin: true}
        );
      }
      isBinRoot = true;
      if (!folderResponse) {
        throw new Error("Folder not found");
      }

      // Find all nested files and update their `isMovedToBin`
      const res = await File.updateMany(
        { parentId: id },
        { isMovedToBin: true }
      );

      // Find all nested subfolders
      const subfolders = await Folder.find({ parentId: id });

      // Recursively move all subfolders to bin
      for (const subfolder of subfolders) {
        await moveToBin(subfolder._id, "folder", subfolder.name);
      }

      return folderResponse;
    }

    // Move the file to bin
    const fileResponse = await File.findOneAndUpdate(
      { _id: id },
      { isMovedToBin: true, isBinRoot: true }
    );

    if (!fileResponse) {
      throw new Error("File not found");
    }

    return fileResponse;
  } catch (error) {
    throw new Error(`Error while moving to bin: ${error.message}`);
  }
};

const findBinItems = async (userId) => {
  try {
    console.log(userId);
    const files = await File.find({
      isBinRoot:true,
      $or: [
        {
          owner: userId,
          isMovedToBin: true,
          isDeleted: false,
        },
        {
          sharedWith: {
            $elemMatch: { userId, isMovedToBin: true, isDeleted: false },
          },
        },
      ],
    });
    const folder = await Folder.find({
      isBinRoot:true,
      $or: [
        {
          owner: userId,
          isMovedToBin: true,
          isDeleted: false,
        },
        {
          sharedWith: {
            $elemMatch: { userId, isMovedToBin: true, isDeleted: false },
          },
        },
      ],
    });
    let data = folder.concat(files);
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(`error whilw fetching bin items:${error.message}`);
  }
};
// till here
const restoreFiles = async (data) => {
  try {
    const { id: rawId, userId, type, name } = data;
    const id = rawId === "null" ? null : rawId;
    const Model = type === "folder" ? Folder : File;

    const document = await Model.findOne({ _id: id });
    if (!document) throw new Error("Document not found");

    const isOwner = document.owner.toString() === userId.toString();
    let updateFilter;
    let updateAction;

    if (isOwner) {
      updateFilter = { _id: id, isMovedToBin: true, isDeleted: false, name };
      updateAction = { isMovedToBin: false };
    } else {
      updateFilter = {
        _id: id,
        name,
        "sharedWith.userId": userId,
        "sharedWith.isMovedToBin": true,
        "sharedWith.isDeleted": false,
      };
      updateAction = { $set: { "sharedWith.$.isMovedToBin": false } };
    }

    const response = await Model.findOneAndUpdate(updateFilter, updateAction);
    if (!response) {
      throw new Error(
        `${type === "folder" ? "Folder" : "File"} not found or already restored`
      );
    }

    if (type === "folder" && isOwner) {
      // Restore nested files
      await File.updateMany({ parentId: id }, { isMovedToBin: false });

      // Restore nested subfolders
      const subfolders = await Folder.find({ parentId: id });
      for (const subfolder of subfolders) {
        await restoreFiles({
          id: subfolder._id,
          userId,
          type: "folder",
          name: subfolder.name,
        });
      }
    }

    return response;
  } catch (error) {
    throw new Error(`Error restoring document: ${error.message}`);
  }
};

const deleteFile = async (data) => {
  try {
    const { id, userId, type } = data;
    const Model = type === "foler" ? "Folder" : "File";
    const document = await Model.find({ _id: id });
    if (document.owner === userId) {
      Model.findOneAndUpdate(
        { _id: id, isMovedToBin: true },
        { isDeleted: true }
      );
    } else {
      Model.findOneAndUpdate(
        {
          _id: id,
          "sharedWith.userId": userId,
          "sharedWith.isMovedToBin": true,
          "sharedWith.isDeleted": false,
        },
        { $set: { "sharedWith.$.isDeleted": true } }
      );
    }
  } catch (error) {
    throw new Error(`error deleting:${error.message}`);
  }
};

const fileShare = async (data) => {
  try {
    let { id, type, userId, receivers, name } = data;
    console.log(data, "data");

    // Prepare shared user objects
    const sharedUsers = receivers.map((receiverId) => ({
      userId: receiverId,
      isMovedToBin: false,
      isDeleted: false,
    }));

    // Check if ID is valid (handle "null" case)
    id = id === "null" ? null : id;
    console.log("Shared Users:", sharedUsers);

    // Step 1: Handle Folder Sharing
    if (type === "folder") {
      // Step 1.1: Verify the folder's existence and access
      const folder = await Folder.findOne({ _id: id, owner: userId, name });
      if (!folder) {
        throw new Error("Folder not found or access denied.");
      }

      // Step 1.2: Handle root folder check (if parentId is null)
      if (folder.parentId === null) {
        console.log("This is a root folder.");
      }

      // Step 2: Share the main folder
      await Folder.findOneAndUpdate(
        { _id: id, owner: userId, name },
        { $addToSet: { sharedWith: { $each: sharedUsers } } }
      );

      // Step 3: Share root-level files directly inside this folder
      await File.updateMany(
        { parentId: id, owner: userId },
        { $addToSet: { sharedWith: { $each: sharedUsers } } }
      );
      console.log("Root-level files inside the folder shared successfully.");

      // Step 4: Share all nested subfolders and their files recursively
      await shareNestedItems(id); // This will process subfolders and files

      return {
        message:
          "Folder, root-level files, and all nested items shared successfully",
      };
    } else {
      // Step 5: Handle file sharing (non-folder)
      const response = await File.findOneAndUpdate(
        { _id: id, owner: userId, name },
        { $addToSet: { sharedWith: { $each: sharedUsers } } }
      );
      return response;
    }

    // Recursively share all nested items (subfolders and files)
    async function shareNestedItems(parentId) {
      // Fetch all subfolders under the current parent folder
      const subfolders = await Folder.find({ parentId });
      for (const folder of subfolders) {
        // Share each subfolder
        await Folder.findOneAndUpdate(
          { _id: folder._id },
          { $addToSet: { sharedWith: { $each: sharedUsers } } }
        );

        // Recursively process deeper subfolders
        await shareNestedItems(folder._id);
      }

      // Fetch all files under the current parent folder
      const subFiles = await File.find({ parentId });
      for (const file of subFiles) {
        // Share each file
        await File.findOneAndUpdate(
          { _id: file._id },
          { $addToSet: { sharedWith: { $each: sharedUsers } } }
        );
      }
    }
  } catch (error) {
    throw new Error(`Error sharing file/folder: ${error.message}`);
  }
};

const getSharedFiles = async (data) => {
  try {
    const { userId } = data;
    console.log(userId);

    if (!userId) throw new Error("UserId missing");
    const files = await File.find({
      parentId: null,
      sharedWith: {
        $elemMatch: { userId, isMovedToBin: false, isDeleted: false },
      },
    });

    const folders = await Folder.find({
      parentId: null,
      sharedWith: {
        $elemMatch: { userId, isMovedToBin: false, isDeleted: false },
      },
    });
    console.log(files, folders);
    const merge = folders.concat(files);
    return merge;
  } catch (error) {
    throw new Error(`error while geting shared files:${error.message}`);
  }
};

module.exports = {
  updateLastAccesssed,
  createFolder,
  createFile,
  findFolderChilds,
  findFolder,
  getRecentFiles,
  findFilesStorage,
  moveToBin,
  findBinItems,
  restoreFiles,
  deleteFile,
  fileShare,
  getSharedFiles,
  findLatestFolderandFile
};
