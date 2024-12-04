const Folder = require("../models/folderSchema");
const File = require("../models/fileSchema");


// const findOneFolder = async(name,userId)=>{
//     try {
//         const folder = await Folder.findOne({name,userId})
//         return folder
//     } catch (error) {
//         throw new Error("error finding folder " + error.message)
//     }
// }

const createFolder = async(data)=>{
  const {name,parentId,userId} = data
  if(!name || !parentId, !userId) throw new Error ("credentials for creating folder are missing")
     parentId === "null" ? parentId = null : parentId
   try {
     const folder = await Folder.create({
       name,
       parentId,
       userId
     })
     return folder
   } catch (error) {
      throw new Error("error inserting folder" + error.message)
   }
}

const createFile = async(fileData)=>{
   try {
     const file = await File.create(fileData)
     return file
   } catch (error) {
     throw new Error("error wfile creating file" + error.message)
   }
}

const findFolderChilds = async(data)=>{
 try {
  
    let {userId,parentId} = data;
    if(!parentId, !userId) throw new Error ("credentials for finding childs are missing")

    parentId = parentId === "null" ? null : parentId; 
 
    const files   = await File.find({userId,parentId})
    const folders = await Folder.find({userId,parentId}) 
    
    const childrens = [
      ...folders.map(folder => ({...folder.toObject() })),
      ...files.map(file => ({...file.toObject() }))
  ];
    return childrens
 } catch (error) {
    throw new Error(`error while fetching folder childs : ${error.message}`)
 }
}

const findFolder = async(data)=>{
  try {
      const {userId,name = null,parentId} = data
      if(name){
        const folder = await Folder.findOne({userId,parentId,name})
        return folder
      }else{
        const folder = await Folder.findOne({_id:parentId,userId})
        return folder
      }
  } catch (error) {
     throw new Error(`error while fetching folder : ${error.message}`)
  }
 }

 const getRecentFiles = async (userId) => {
  try {
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0)); // Midnight today
      const startOfLastWeek = new Date(startOfToday);
      startOfLastWeek.setDate(startOfToday.getDate() - 7);
      const startOfLastMonth = new Date(startOfToday);
      startOfLastMonth.setDate(startOfToday.getDate() - 30);

      // Single database query for all relevant files
      const files = await File.find({
          userId,
          lastAccessed: { $gte: startOfLastMonth }, // Fetch files accessed in the last month and older
      }).sort({ lastAccessed: -1 });

      // Categorize files in application logic
      const recentFiles = {   
          today: [],
          lastWeek: [],
          lastMonth: [],
          older: [],
      };

      files.forEach(file => {
          if (file.lastAccessed >= startOfToday) {
              recentFiles.today.push(file);
          } else if (file.lastAccessed >= startOfLastWeek) {
              recentFiles.lastWeek.push(file);
          } else if (file.lastAccessed >= startOfLastMonth) {
              recentFiles.lastMonth.push(file);
          } else {
              recentFiles.older.push(file);
          }
      });

      return recentFiles;
  } catch (error) {
      throw new Error(`Error fetching recent files: ${error.message}`);
  }
};

const updateLastAccesssed = async(data)=>{
  try {
    const {userId,fileId} = data;
    const response  =  await File.updateOne({_id:fileId,userId},{lastAccessed:new Date()})
    return response
  } catch (error) {
    throw new Error("error while updating last Accessedd")
  }
}

const findFilesStorage = async(userId)=>{
  try {
    const files = await File.aggregate([{
        $match:{
           userId:userId
       },
       $group:{
         _id:"$userId",
         totalStorage:{
          $sum:"$size" 
         },
         files:{
           $push:"$$ROOT"
          }
       },
       $project:{
         userId:"$_id",
         files:1,
         totalStorage:1,
         _id:0
       }
    }])
    return files
  } catch (error) {
     throw new Error(`Error while fetching totol storage of file : ${error.message}`)
  }
}




module.exports = {
  updateLastAccesssed,
  createFolder,
  createFile,
  findFolderChilds,
  findFolder,
  getRecentFiles,
  findFilesStorage
}