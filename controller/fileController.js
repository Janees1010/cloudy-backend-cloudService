const fileUploadService = require("../service/fileService/fileUploadService")
const getParentIdService = require("../utils/getParentIdService")
const getRecentFilesService = require("../service/fileService/getRecentFilesService")
const updateLastAccessedService = require("../utils/updateLastAccessedService")
const getFilesStorageService = require("../service/fileService/getFilesStorageService")
const generatePreSignedUrlService = require("../utils/generatePreSignedUrlService")
const MoveToBinService = require("../utils/MoveToBinService")
const getBinFilesAndFoldersService = require("../utils/getBinFilesAndFoldersService")
const handleFileRestoreService = require("../service/fileService/handleFileRestoreService")
const handleDeleteService = require("../utils/handleDeleteService")
const handleFileShareService = require("../utils/handleShareService")
const getSharedFilesService = require("../utils/getSharedService")


const handleFileUpload = async(req,res)=>{
    try {
       const {file}  = req.body
       const response = await fileUploadService(req.query,file[0])
       return res.status(200).json(response)
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
       const response  = await getFilesStorageService(req.query)
       return res.status(200).json(response)
    } catch (error) {
          return res.status(500).json(error.message);
    }
  }

  const generatePreSignedUrlHandler = async(req,res)=>{
   try {
      const  signedUrl =  await generatePreSignedUrlService(req.body.files)
      console.log(signedUrl);
      return res.status(200).json(signedUrl)
    } catch (error) {
      return res.status(500).json(error.message);
   }
  }

  const handleMoveToBin = async(req,res)=>{
   try {
      const {id,type,name} = req.body;
      const response  = await MoveToBinService(id,type,name)
      return res.status(200).json({message:"File Moved to Bin successfully"})
   } catch (error) {
      return res.status(500).json(error.message);
   }
 }

 const getBinFilesAndFolders = async(req,res)=>{
   try {
      const response  =  await getBinFilesAndFoldersService(req.query)
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json(error.message);
   }
 }

 const handleFileRestore = async(req,res)=>{
    try {
      console.log(req.query);
      const response = await handleFileRestoreService(req.query)
      console.log(response,"res");
      
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(error.message);
    }
 }

 const handleDelete = async(req,res)=>{
    try {
      const response  =  await handleDeleteService(req.body)
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(error.message);
    }
 }

 const handleShare = async(req,res)=>{
   try {
      const response = await handleFileShareService(req.body)
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json(error.message);  
   }
 }
 const getSharedFiles = async(req,res)=>{
   try {
      const response = await getSharedFilesService(req.query)
      return res.status(200).json(response)
   } catch (error) {
      return res.status(500).json(error.message);  
   }
 }

  module.exports = {
    handleFileUpload,  
    getParentId,
    getRecentFiles,
    hadleUpdateLastAccessed,
    getFilesStorage,
    generatePreSignedUrlHandler,
    handleMoveToBin,
    getBinFilesAndFolders,
    handleFileRestore,
    handleDelete,
    handleShare,
    getSharedFiles
  }