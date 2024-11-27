const {findFolders} = require("../repository/cloudRepository")

const getFoldersService = async(userId)=>{
    try {
        const folders = await findFolders(userId)
        return folders
    } catch (error) {
       throw new Error(error.message)   
    }
}

module.exports = getFoldersService
