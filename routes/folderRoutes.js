const express = require("express")
const router = express.Router()
// const {upload} = require("../middleware/imageUpload")
const {
 handleUploadFolder,
 handleCreateFolder,
 getFolderChilds,
 getLatestFolders,
 getSearchResult,
 handleDelete
} = require("../controller/folderController")


router.post("/upload",handleUploadFolder)
router.post("/create", handleCreateFolder)
router.get("/childrens",getFolderChilds)
router.get("/latest",getLatestFolders)
router.get("/search",getSearchResult)


module.exports = router;  