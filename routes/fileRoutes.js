const express = require("express")
const router = express.Router()
const {upload} = require("../middleware/imageUpload")
const {  
    handleFileUpload,
    getParentId,
    getRecentFiles,
    hadleUpdateLastAccessed,
    getFilesStorage
} = require("../controller/fileController")


router.post("/upload",upload.single("file"),handleFileUpload)
router.get("/getParentId",getParentId)
router.get("/recent",getRecentFiles)
router.get('/update-LastAcceseed',hadleUpdateLastAccessed)
router.get("/storage",getFilesStorage)

module.exports = router; 