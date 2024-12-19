const {updateLastAccesssed}  =  require("../repository/cloudRepository")

const  updateLastAccessedService = async(data)=>{
    try { 
        const response   = await updateLastAccesssed(data)
        return response
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports =  updateLastAccessedService   