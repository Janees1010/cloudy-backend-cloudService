const {createFile,findFolderChilds} = require("../repository/cloudRepository")

const fileUploadService = async(body,file)=>{
    try {
        let {userId,parentId} = body
        parentId = parentId === "null" ? null : parentId;  
        console.log(body,parentId);
        
        if(!file || !parentId, !userId) throw new Error ("fileUpload crendentials are missing")
        const fileDetails = {
            name:file.originalname,
            size:file.size,
            type:file.mimetype,
            s3Url:file.location,
            userId,
            parentId
        }
        const response  = await createFile(fileDetails)
        const newChildrens = await findFolderChilds(body)
        return {parentId,childrens:newChildrens}
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = fileUploadService