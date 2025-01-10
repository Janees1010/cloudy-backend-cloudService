const folderUploadService = require("../service/folderService/folderUploadService")
const getFolderChildsService = require("../service/folderService/getFolderChilds")
const createFolderService = require("../service/folderService/createFolderService")
const getLatestFolderFilessService = require("../service/folderService/getLatestFoldersService")
const handleSearchService = require("../utils/getSearchResultsService")

const handleUploadFolder = async (req, res) => {
  try {   
    const {files} = req.body; 
    if ( !files.length) {
      return res.status(400).json({ message: "Files is missing" });
    }
    const response  =  await folderUploadService(req.query,files)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

   
const getFolderChilds = async(req,res)=>{
  try {
      const childrens = await getFolderChildsService(req.query)
      return res.status(200).json(childrens)
  } catch (error) {
     return res.status(500).json(error.message)
  }
}  

const handleCreateFolder = async(req,res)=>{                                                          
   try {
     const newFolder = await createFolderService(req.body)
     newFolder.childrenType = "folder"
     return res.status(200).json({message:"folder created successfully",newFolder})
   } catch (error) {
      return res.status(500).json(error.message)
   }
}

const getLatestFolders = async(req,res)=>{
  try {
      const {userId} = req.query;
      const response  = await getLatestFolderFilessService(userId)
      return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
const getSearchResult = async(req,res)=>{
  try {
      const {query,userId} = req.query;
      const result  =  await handleSearchService(query,userId)
      return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}



module.exports = {
  handleUploadFolder,
  getFolderChilds,
  handleCreateFolder,
  getLatestFolders,
  getSearchResult,
  
};    
