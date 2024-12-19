const {getSharedFiles } = require("../repository/cloudRepository")

const getSharedFilesService = async(data)=>{
    try {
        const response = await getSharedFiles(data)
        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getSharedFilesService