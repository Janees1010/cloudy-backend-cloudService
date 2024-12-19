const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config()

const generatePreSignedUrlService = async(fileDetailsArray)=>{
    try {
        const s3 = new S3Client({
            region:process.env.REGION,
            credentials:{
                accessKeyId:process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
            }
        })
        const signedUrls = await Promise.all(
            fileDetailsArray.map(async(file)=>{ 
               const command = new PutObjectCommand({
                   Bucket:"stackup-bucket", 
                   Key:`uploads/${Date.now()}-${file.name}`,
                   ContentType:file.type
               })
               const presignedUrl = await getSignedUrl(s3,command,{expiresIn:8000})
               return {
                url:presignedUrl,
                name:file.name,
                size:file.size,
                type:file.type,
                webKitRelativePath:file.webkitRelativePath
             }
           })
        )
        return signedUrls     
    } catch (error) {
         throw new Error(`error generating preSignedUrl:${error.message}`)  
    }
} 

module.exports = generatePreSignedUrlService