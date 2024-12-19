const {findBinItems} = require("../repository/cloudRepository")

const getBinFilesAndFoldersService = async(userId)=>{
    try {
        const response  = await findBinItems(userId)
        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports =  getBinFilesAndFoldersService;