const Folder = require("../models/folderSchema");
const File = require("../models/fileSchema");
const mongoose = require("mongoose");
const { loadConfigFromFile } = require("vite");
const {
  getUserDetailsByIds,
} = require("../../userServices/controller/userController");

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

const findLatestFolderandFile = async (userId) => {
  try {
    const folders = await Folder.find({
      parentId: null,
      $or: [
        {
          owner: userId,
          isDeleted: false,
          isMovedToBin: false,
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
    })
      .sort({ _id: -1 })
      .limit(6);
    const files = await File.find({
      $or: [
        {
          owner: userId,
          isDeleted: false,
          isMovedToBin: false,
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
    })
      .sort({ _id: -1 })
      .limit(10);
    console.log(files);

    return [folders, files];
  } catch (error) {
    throw new Error(`error while fetching latest folders:${error.message}`);
  }
};

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
    let { userId, parentId, type, page } = data;
    console.log(data);
    
    if (!userId)
      throw new Error("Credentials for finding children are missing");

    parentId =
      parentId === "null"
        ? null
        : parentId
        ? new mongoose.Types.ObjectId(parentId)
        : null;

    // Fetch files
    console.log(parentId);
    
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

    const folders = await Folder.find(query).limit(10);
    const limit = page * 10 - folders.length;
    const files = await File.find(query).limit(limit);
    const folderCount = await Folder.countDocuments(query);
    const fileCount = await File.countDocuments(query);
    // Combine results

    const totalDocumentCount = fileCount + folderCount;

    const childrens = folders.concat(files);

    if (type === "shared") {
      const res = await fetchUserDetails(childrens);
      return { childrens: res, totalDocumentCount };
    } else {
      return { childrens, totalDocumentCount };
    }
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

const fetchUserDetails = async (data) => {
  const response = await fetch("http://localhost:3500/user/details", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const res = await response.json();
  return res;
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
    let files = await File.find({
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
    })
      .sort({ lastAccessed: -1 })
      .limit(10);

    // Categorize files in application logic

    const recentFiles = {
      today: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    };

    const data = await fetchUserDetails(files);

    files.forEach((file, index) => {
      if (file.lastAccessed >= startOfToday) {
        recentFiles.today.push(data[index]);
      } else if (file.lastAccessed >= startOfLastWeek) {
        recentFiles.lastWeek.push(data[index]);
      } else if (file.lastAccessed >= startOfLastMonth) {
        recentFiles.lastMonth.push(data[index]);
      } else {
        recentFiles.older.push(data[index]);
      }
    });
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

const findFilesStorage = async (query) => {
  const { userId, currentPage, getPercentage = false } = query;
  let page = currentPage;
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
  const limit = page * 10;

  try {
    const query = {
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
    };
    const files = await File.aggregate([
      {
        $match: query,
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
        $set: {
          files: { $slice: ["$files", limit] }, // Limit the files array to 10 documents
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
    const totalDocumentCount = await File.countDocuments(query);

    if (getPercentage) {
      if (!files.length) return 0.0;
      const storageUsed = files[0].totalStorage;
      const max = 10 * 1024 * 1024 * 1024;
      const percentageUsed = (storageUsed / max) * 100;
      console.log(percentageUsed, "percentage");
      return percentageUsed.toFixed(2);
    } else {
      return { files, totalDocumentCount };
    }
  } catch (error) {
    throw new Error(
      `Error while fetching totol storage of file : ${error.message}`
    );
  }
};

// let isBinRoot = true;

const moveToBin = async (id, type, name, userId, isBinRoot = true) => {
  try {
    const Model = type === "folder" ? Folder : File;
    const file = await Model.findById(id);

    const isOwner = file.owner.toString() === userId;

    let updateQuery;
    let matchQuery;
    let fileMatchQuery;

    if (isOwner) {
      updateQuery = { isMovedToBin: true, isBinRoot:isBinRoot};
      matchQuery = { _id: id, name };
      fileMatchQuery = { parentId: id };
    } else {                       
      matchQuery = {
        _id: id,
        name,
        "sharedWith.userId": userId,
      };
      fileMatchQuery = { parentId: id, "sharedWith.userId": userId };   
      updateQuery = {
        $set: {
          "sharedWith.$.isMovedToBin": true, // Update the specific object in the array
          "sharedWith.$.isBinRoot": isBinRoot,
        },
      };
    }
    // Define match and update queries

    if (type === "folder") {
      id = id === "null" ? null : id;
      let folderResponse;

      // Move the root folder to bin

      folderResponse = await Folder.findOneAndUpdate(matchQuery, updateQuery);
      

      isOwner ? updateQuery.isBinRoot = false : updateQuery.$set["sharedWith.$.isBinRoot"] = false
      isBinRoot = false;

      if (!folderResponse) {
        throw new Error("Folder not found");
      }

      // Find all nested files and update their `isMovedToBin`

      await File.updateMany(fileMatchQuery, updateQuery);

      // Find all nested subfolders
      const subfolders = await Folder.find({ parentId: id });  

      // Recursively move all subfolders to bin
      for (const subfolder of subfolders) {
        await moveToBin(subfolder._id, "folder", subfolder.name, userId , isBinRoot);
      }

      return folderResponse;  
    }

    // Move the file to bin
    const fileResponse = await File.findOneAndUpdate(matchQuery, updateQuery);

    if (!fileResponse) {
      throw new Error("File not found");
    }

    return fileResponse;
  } catch (error) {
    throw new Error(`Error while moving to bin: ${error.message}`);
  }
};

const findBinItems = async (details) => {
  try {
    const { userId, page } = details;

    const query = {
      $or: [
        {
          owner: userId,
          isMovedToBin: true,
          isDeleted: false,
          isBinRoot: true,
        },
        {
          sharedWith: {
            $elemMatch: {
              userId,
              isMovedToBin: true,
              isDeleted: false,
              isBinRoot: true,
            },
          },
        },
      ],
    };
    const folder = await Folder.find(query).limit(page * 10);

    const limit = page * 2 - folder.length;
    const files = limit != 0 ? await File.find(query).limit(limit) : [];

    const fileCount = await File.countDocuments(query);
    const folderCount = await Folder.countDocuments(query);
    const totalCount = fileCount + folderCount;
    let data = folder.concat(files);
    return { data, totalCount };
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

    if (type === "folder") {
      // Restore nested files
       if(isOwner){
         await File.updateMany({ parentId: id },  { isMovedToBin: false });
       }else{
        await File.updateMany(
          { parentId: id, "sharedWith.userId": userId },  // Match documents
          { $set: { "sharedWith.$.isMovedToBin": false } }  // Update the specific field
        );       }

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
    const Model = type === "folder" ? Folder : File;
    const document = await Model.findById(id);
    if (document.owner.toString() === userId) {
      await Model.findOneAndUpdate(
        { _id: id, isMovedToBin: true },
        { isDeleted: true }
      );
    } else {
      await Model.findOneAndUpdate(
        {
          _id: id,
          "sharedWith.userId": userId,
          "sharedWith.isMovedToBin": true,
          "sharedWith.isDeleted": false,
        },
        { $pull: { sharedWith: { userId: userId } } }  
      );
    }
    const file = await Model.findById(id);
    if (file.isDeleted && (!file.sharedWith || file.sharedWith.length === 0)) {
      hardDeleteFiles({ userId, file });
    }
     
  } catch (error) {
    throw new Error(`error deleting:${error.message}`);
  }
}   
              
const hardDeleteFiles = async (data) => {
  try {
    const { userId, file } = data;                   
    console.log(data)
    let query = {
      parentId: file._id,  // Ensure this is correct and exists
      $or: [
        { owner: userId, isMovedToBin: true },  // Files owned by the user and in the bin
        {
          sharedWith: {
            $elemMatch: { userId, isMovedToBin: true },  // Files shared with the user and in the bin
          },
        },
      ],
    };
                                       
    if (file && file.type === "folder") {
       console.log("in")
      await Folder.findByIdAndDelete(file._id);                            
      await File.deleteMany(query);
      const folders = await Folder.find(query);
      for (sub of folders) {
        await hardDeleteFiles({userId,file:sub});
      }
    } else {
       await File.findByIdAndDelete(file._id); 
    }
  } catch (error) {
    throw new Error(`error while removing files from db : ${error.message}`);
  }
};

const fileShare = async (data) => {
  try {
    let { id, type, userId, receivers, name } = data;

    // Prepare shared user objects
    const sharedUsers = receivers.map((receiverId) => ({
      userId: receiverId,
      isMovedToBin: false,
      isDeleted: false,
    }));

    // Check if ID is valid (handle "null" case)
    id = id === "null" ? null : id;

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

const getSharedFiles = async (details) => {
  try {
    const { userId } = details;

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
    const merge = folders.concat(files);
    const data = await fetchUserDetails(merge);
    return merge;
  } catch (error) {
    throw new Error(`error while geting shared files:${error.message}`);
  }
};

const searchFileOrFolder = async (query) => {
  try {
    const files = await File.find({
      name: new RegExp(query, "i"),
      isMovedToBin: false,
      isDeleted: false,
    });
    const folders = await Folder.find({
      name: new RegExp(query, "i"),
      isMovedToBin: false,
      isDeleted: false,
    });
    return folders.concat(files);
  } catch (error) {
    throw new Error(`error while search:${error.message}`);
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
  findLatestFolderandFile,
  searchFileOrFolder,
};
