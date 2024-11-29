const {
    createFolder,
    createFile,
    findFolderChilds
} = require("../repository/cloudRepository")

const folderUploadService = async (data, filesArray) => {
  try {
      let { parentId = null, userId } = data;
      const rootFolderId = parentId; 
      const folderMap = new Map();
      folderMap.set("", rootFolderId); 

      for (let file of filesArray) {
          const paths = file.webKitRelativePath.split("/");
          const fileName = paths.pop(); 
          let currentPath = ""; 
          let currentParentId = rootFolderId; 

          for (let folderName of paths) {
              currentPath += `/${folderName}`;
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
      const newFolderChilds = await findFolderChilds({userId,parentId})
      return {parentId,childrens:newFolderChilds}
  } catch (error) {
      console.error("Error in folderUploadService:", error.message);
      throw new Error(error.message);
  }
};


module.exports = folderUploadService    