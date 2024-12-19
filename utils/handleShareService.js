
const {fileShare} = require("../repository/cloudRepository")
const handleFileShareService = async(data)=>{
    try {
        const response = await fileShare(data)
        return response
    } catch (error) {
        throw  new Error(error.message)   
    }
}

module.exports = handleFileShareService;                                                                             