const {findBinItems} = require("../repository/cloudRepository")

const getBinFilesAndFoldersService = async(data)=>{
    try {
        const response  = await findBinItems(data)
        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports =  getBinFilesAndFoldersService;