const {findFilesStorage} = require("../../repository/cloudRepository")

const getFilesStorageService = async(data)=>{
     try {
        const response = await findFilesStorage(data)
        return response
     } catch (error) {
         throw new Error(error.message)
     }
}

module.exports = getFilesStorageService