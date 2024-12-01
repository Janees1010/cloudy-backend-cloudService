const express = require("express")
const router = express.Router()
const {upload} = require("../middleware/imageUpload")
const {
 handleUploadFolder,
 handleCreateFolder,
 getFolderChilds,
} = require("../controller/folderController")


router.post("/upload",upload.array("files[]"), handleUploadFolder)
router.post("/create", handleCreateFolder)
router.get("/childrens/:parentId/:userId",getFolderChilds)


module.exports = router;