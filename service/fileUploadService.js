const {createFile,findFolderChilds} = require("../repository/cloudRepository")

const fileUploadService = async(body,file)=>{
    try {
        let {userId,parentId} = body
        if(!file || !parentId, !userId) throw new Error ("fileUpload crendentials are missing")
        const fileDetails = {
            name:file.filename,
            size:file.size,
            type:file.type,
            s3Url:file.location,
            userId,
            parentId
        }
        const response  = await createFile(fileDetails)
        const newChildrens = await findFolderChilds(body)
        return newChildrens
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = fileUploadService