const {findLatestFolderandFile} = require("../../repository/cloudRepository")

const getLatestFolderFilessService = async(userId)=>{
    try {
        const response  = await findLatestFolderandFile(userId)
        return response
    } catch (error) {
       throw new Error(error.message)
    }
}

module.exports = getLatestFolderFilessService