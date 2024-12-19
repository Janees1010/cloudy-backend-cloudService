const {moveToBin} =  require("../repository/cloudRepository")

const MoveToBinService = async(id,type,name)=>{
     try {
        const response = await moveToBin(id,type,name)
        return response
     } catch (error) {
        throw new Error(error.message)
     }
}

module.exports = MoveToBinService