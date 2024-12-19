const {createFile,findFolderChilds} = require("../../cloudRepositoryrepository/cloudRepository")

const fileUploadService = async(body,file)=>{
    try {
        let {userId,parentId} = body
        parentId = parentId === "null" ? null : parentId;  
        console.log(body,parentId);
        
        if(!file || !parentId, !userId) throw new Error ("fileUpload crendentials are missing")
        const fileDetails = {
            name:file.name,
            size:file.size,
            type:file.type,
            s3Url:file.url,
            owner:userId,
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