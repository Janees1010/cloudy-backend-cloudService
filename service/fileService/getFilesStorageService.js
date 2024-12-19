const {findFilesStorage} = require("../../repository/cloudRepository")

const getFilesStorageService = async(userId)=>{
     try {
        const response = findFilesStorage(userId)
        return response
     } catch (error) {
         throw new Error(error.message)
     }
}

module.exports = getFilesStorageService