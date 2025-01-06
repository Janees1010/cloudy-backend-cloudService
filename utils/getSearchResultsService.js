const {searchFileOrFolder} = require("../repository/cloudRepository")

const getSearchResultsService = async(query)=>{
    try {
        const response = await searchFileOrFolder(query)
        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = getSearchResultsService