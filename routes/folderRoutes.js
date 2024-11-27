const express = require("express")
const router = express.Router()
const {upload} = require("../middleware/imageUpload")
const {
 handleUploadFolder,
 handleFileUpload,
 getFolderChilds,
} = require("../controller/folderUploadController")


router.post("/upload",upload.array("files[]"), handleUploadFolder)
router.get("/childrens/:parentId/:userId",getFolderChilds)
// router.post("/",upload.single("file"), handleFileUpload)


module.exports = router;