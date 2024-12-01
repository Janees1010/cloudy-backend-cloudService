const fileUploadService = require("../service/fileUploadService")

const handleFileUpload = async(req,res)=>{
    try {
       const file  = req.files[0]
       const response = await fileUploadService(req.body,file)
       return res.status(200).json({message:"file uploaded successfully",response})
    } catch (error) {
       return res.status(500).json(error.message);
    }
  }

  module.exports = {
    handleFileUpload
  }