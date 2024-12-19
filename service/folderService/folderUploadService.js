const {
    createFolder,
    createFile,
    findFolderChilds
} = require("../../repository/cloudRepository")

const folderUploadService = async (data, filesArray) => {
  try {
      let { parentId = null, userId } = data;
      if(!parentId, !userId) throw new Error ("folder upload credentials are missing")
      const rootFolderId = parentId; 
      const folderMap = new Map();
      folderMap.set("", rootFolderId); 

      for (let file of filesArray) {
          console.log(file,"file");
          const paths = file.webKitRelativePath.split("/");
          const fileName = paths.pop(); 
          let currentPath = ""; 
          let currentParentId = rootFolderId; 

          for (let folderName of paths) {
              currentPath += `/${folderName}`;
              // Check if the folder already exists in the map 
              if (!folderMap.has(currentPath)) {
                  // Create the folder and store its ID in the map
                  const folder = await createFolder({name:folderName, parentId:currentParentId, userId});
                  folderMap.set(currentPath, folder._id);
              }
              // Update the current parent ID to the resolved folder ID
              currentParentId = folderMap.get(currentPath); 
          }
          // After creating or resolving folders, create the file
          const fileDetails = {
              name: fileName,
              parentId: currentParentId,
              owner:userId,
              size: file.size,
              type: file.type,
              s3Url: file.url,
          };
          await createFile(fileDetails);
      }
      const newFolderChilds = await findFolderChilds({userId,parentId,type:"drive"})
      return {parentId,childrens:newFolderChilds}
  } catch (error) {
      console.error("Error in folderUploadService:", error.message);
      throw new Error(error.message);  
  }
};


module.exports = folderUploadService    