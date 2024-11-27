const {
    findOneFolder,
    createFolder,
    createFile
} = require("../repository/cloudRepository")

const folderUploadService = async (data, filesArray) => {
  try {
      let { parentId = null, userId } = data;
      const rootFolderId = parentId; // Root folder (could be null for top-level folders)

      // Map to store resolved folder IDs for paths
      const folderMap = new Map();
      folderMap.set("", rootFolderId); // Root path starts with the root folder ID

      for (let file of filesArray) {
          console.log("Processing file:", file.name);

          // Split filename and folder path
          const paths = file.webKitRelativePath.split("/");
          const fileName = paths.pop(); // Extract the file name
          let currentPath = ""; // Track the full folder path
          let currentParentId = rootFolderId; // Start from the root folder

          for (let folderName of paths) {
              currentPath += `/${folderName}`; // Build the full path for the current folder

              // Check if the folder already exists in the map
              if (!folderMap.has(currentPath)) {
                  // Create the folder and store its ID in the map
                  const folder = await createFolder(folderName, currentParentId, userId);
                  folderMap.set(currentPath, folder._id);
              }

              // Update the current parent ID to the resolved folder ID
              currentParentId = folderMap.get(currentPath);
          }

          // After creating or resolving folders, create the file
          const fileDetails = {
              name: fileName,
              parentId: currentParentId,
              userId,
              size: file.size,
              type: file.mimetype,
              s3Url: file.location,
          };
          await createFile(fileDetails);
      }
  } catch (error) {
      console.error("Error in folderUploadService:", error.message);
      throw new Error(error.message);
  }
};


module.exports = folderUploadService