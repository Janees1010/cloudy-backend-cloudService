const {createFile} = require("../repository/cloudRepository")

const fileUploadService = (body,file)=>{
    try {
        let {userId,parentId} = body
        const fileDetails = {
            name:file.filename,
            size:file.size,
            type:file.type,
            s3Url:file.location,
            userId,
            parentId
        }
        const response  = createFile(fileDetails)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = fileUploadService