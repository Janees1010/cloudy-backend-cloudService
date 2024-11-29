const mongoose = require("mongoose")
require("dotenv").config()

const connectDb = async()=>{
     try {
        await mongoose.connect(process.env.DB_URL)
        console.log("databse connected");
        
     } catch (error) {
         console.log(error.message);
     }
}

module.exports = connectDb;        