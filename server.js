const express = require("express")
const app = express()
const connectDb = require("./dbConnection/connections")
const cors = require("cors")
const folderRoutes = require("./routes/folderRoutes")
const fileRoutes = require("./routes/fileRoutes")
require("dotenv").config()

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true 
})) 

app.use(express.json())  

app.use("/folder",folderRoutes)   
app.use("/file",fileRoutes)

app.listen(process.env.PORT,() => console.log(`server running on : ${process.env.PORT}`))      
connectDb()   