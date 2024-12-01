const folderUploadService = require("../service/folderUploadService")
const getFolderChildsService = require("../service/getFolderChilds")
const createFolderService = require("../service/createFolderService")

const handleUploadFolder = async (req, res) => {
  try {   
     const files = req.files
     const {relativePaths} = req.body; 
    if ( !files.length || !relativePaths) {
      return res.status(400).json({ message: "Files or RelativePath is missing" });
    }
      const fileArray = files.map((file, index) => {
      const relativePath = relativePaths[index];
      return {      
        name:file.originalname,
        location:file.location,  
        mimetype: file.mimetype,  
        size: file.size,
        webKitRelativePath: relativePath,
      };  
    })
    const response  =  await folderUploadService(req.query,fileArray)
    return res.status(200).json({message:"folder uploaded successfully",response})
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


const getFolderChilds = async(req,res)=>{
  try {
      const childrens = await getFolderChildsService(req.params)
      return res.status(200).json({childrens})
  } catch (error) {
     return res.status(500).json(error.message)
  }
}

const handleCreateFolder = async(req,res)=>{
   try {
     const response = await createFolderService(req.body)
     return res.status(200).json({message:"folder created successfully",response})
   } catch (error) {
      return res.status(500).json(error.message)
   }
}

module.exports = {
  handleUploadFolder,
  getFolderChilds,
  handleCreateFolder
};    
