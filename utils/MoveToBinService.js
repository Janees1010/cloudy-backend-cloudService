const {moveToBin} =  require("../repository/cloudRepository")

const MoveToBinService = async(id,type,name,userId)=>{
     try {
        const response = await moveToBin(id,type,name,userId)
        return response
     } catch (error) {
        throw new Error(error.message)
     }
}

module.exports = MoveToBinService