const {getRecentFiles} = require("../repository/cloudRepository")

const  getRecentFilesService = async(userId)=>{
   try {
     const files = await getRecentFiles(userId)
     return files
   } catch (error) {
      throw new Error(error.message)
   }
}

module.exports = getRecentFilesService