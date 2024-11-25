const express = require("express")
const app = express()
const connectDb = require("./dbConnection/connections")
const cors = require("cors")
const folderRoutes = require("")
require("dotenv").config()

app.use(cors())
app.use(express.json())

app.use("/folder",folderRoutes)

connectDb()
app.listen(process.env.PORT,() => console.log(`serevr running on : ${process.env.PORT}`))