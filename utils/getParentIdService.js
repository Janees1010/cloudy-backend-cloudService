const {findFolder} = require("../repository/cloudRepository")

const getParentIdService = async(data)=>{
     try {
        const folder  = await findFolder(data)
        console.log(folder);
        return folder.parentId
     } catch (error) {
        throw new Error(error.message)
     }
} 

module.exports = getParentIdService