const express = require("express")
const router = express.Router()
// const {generatePresignedUrls} = require("../middleware/imageUpload")
// const {upload} =  require("../middleware/imageUpload")
const {  
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
} = require("../controller/fileController")

const multer = require("multer")
const storage = multer.memoryStorage(); 
// Initialize multer with the memory storage configuration
const upload = multer({ storage: storage });


router.post("/upload",handleFileUpload)
router.get("/getParentId",getParentId)
router.get("/recent",getRecentFiles)
router.get('/update-LastAcceseed',hadleUpdateLastAccessed)
router.get("/storage",getFilesStorage)
router.get("/binItems",getBinFilesAndFolders)
router.get("/restore",handleFileRestore)
router.get("/shared",getSharedFiles)
router.post("/getPresignedUrl",generatePreSignedUrlHandler)
router.post("/moveToBin",handleMoveToBin)
router.post("/delete",handleDelete)
router.post("/share",handleShare)

module.exports = router;  