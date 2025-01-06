const {findFolder,createFolder} = require("../../repository/cloudRepository")

const createFolderService = async(data)=>{
    try {
        const folder = await findFolder(data)
        if(folder) throw new Error("folder already exists")
        const response = await createFolder(data)
        // const newChildrens = await findFolderChilds(data)
        return response
    } catch (error) {
       throw new Error(error.message)   
    }
}

module.exports = createFolderService
