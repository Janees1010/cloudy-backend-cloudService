
const folderUploadService = require("../service/folderUploadService")
const fileUploadService = require("../service/fileUploadService")
const getFolderChildsService = require("../service/getFolderChilds")

const handleUploadFolder = async (req, res) => {
  try {
    const files = req.files;
    const {relativePaths} = req.body; 

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
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
    console.log(response,"respponse");
    return res.status(200).json({message:"folder uploaded successfully",response})
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const handleFileUpload = async(req,res)=>{
  try {
     const file  = req.files[0]
     const response = await fileUploadService(req.body,file)
     return res.status(200).json({message:"file uploaded successfully"})
  } catch (error) {
     return res.status(500).json(error.message);
  }
}
const getFolderChilds = async(req,res)=>{
  try {
      console.log(req.params);
    
      const childrens = await getFolderChildsService(req.params)
      console.log(childrens);
      
      return res.status(200).json({childrens})
  } catch (error) {
     return res.status(500).json(error.message)
  }
}

module.exports = {
  handleUploadFolder,
  handleFileUpload,
  getFolderChilds
};    
