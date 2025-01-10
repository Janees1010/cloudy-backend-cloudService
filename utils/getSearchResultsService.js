const {searchFileOrFolder} = require("../repository/cloudRepository")

const getSearchResultsService = async(query,userId)=>{
    try {
        const response = await searchFileOrFolder(query,userId)
        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getSearchResultsService