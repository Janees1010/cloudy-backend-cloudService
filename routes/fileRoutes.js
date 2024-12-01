const express = require("express")
const router = express.Router()
const {upload} = require("../middleware/imageUpload")
const {handleFileUpload} = require("../controller/fileController")


router.post("/upload",upload.single("files"),handleFileUpload)

module.exports = router;