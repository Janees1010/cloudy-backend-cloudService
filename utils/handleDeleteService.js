const {deleteFile} = require("../repository/cloudRepository")
const handleDeleteService = async(data)=>{
      try {
         const response  =  await deleteFile(data)
         return response
      } catch (error) {
        throw new Error(error.message)
      }
}

module.exports = handleDeleteService