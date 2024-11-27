const  {findFolderChilds} =  require("../repository/cloudRepository")

const getFolderChildsService = async(data)=>{
    try {
        const childs = await findFolderChilds(data)
        return childs 
    } catch (error) {
        throw new Error(error.message) 
    }
}

module.exports = getFolderChildsService