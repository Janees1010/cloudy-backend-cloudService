const fileUploadService = require("../service/fileUploadService")
const getParentIdService = require("../service/getParentIdService")
const getRecentFilesService = require("../service/getRecentFilesService")
const updateLastAccessedService = require("../service/updateLastAccessedService")
const getFilesStorageService = require("../service/getFilesStorageService")

const handleFileUpload = async(req,res)=>{
    try {
       const file  = req.file
       const response = await fileUploadService(req.query,file)
       return res.status(200).json({message:"file uploaded successfully",response})
    } catch (error) {
       return res.status(500).json(error.message);
    }
  }

  const getParentId  = async(req,res)=>{
     try {
       const parentId = await getParentIdService(req.query)
       return res.status(200).json({parentId})
     } catch (error) {
        return res.status(500).json(error.message);
     }
  }
  
  const getRecentFiles = async(req,res)=>{
    try {
      const response = await getRecentFilesService(req.query.userId)
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  const hadleUpdateLastAccessed = async(req,res)=>{
     try {
        const response = await updateLastAccessedService(req.query)
        return res.status(200).json(response)
     } catch (error) {
      return res.status(500).json(error.message);
     }
  }

  const getFilesStorage = async(req,res)=>{
    try {
       const response  = await getFilesStorageService(req.query.userId)
    } catch (error) {
      
    }
  }

  module.exports = {
    handleFileUpload,  
    getParentId,
    getRecentFiles,
    hadleUpdateLastAccessed,
    getFilesStorage
  }