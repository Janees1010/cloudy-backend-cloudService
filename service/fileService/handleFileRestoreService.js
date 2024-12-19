const {restoreFiles} = require("../../repository/cloudRepository")

const handleFileRestoreService = async(data)=>{
     try {
        const response  = await restoreFiles(data)
        return response
     } catch (error) {
         throw new Error(error.message)
     }
}

module.exports = handleFileRestoreService