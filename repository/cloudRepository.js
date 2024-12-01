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
      ...folders.map(folder => ({ childrenType: 'folder', ...folder.toObject() })),
      ...files.map(file => ({ childrenType: 'file', ...file.toObject() }))
  ];
    return childrens
 } catch (error) {
    throw new Error(`error while fetching folder childs : ${error.message}`)
 }
}

const findFolder = async(data)=>{
  try {
      const {userId,name,parentId} = data
      const folders = await Folder.findOne({userId,parentId,name})
      return folders
  } catch (error) {
    throw new Error(`error while fetching folder : ${error.message}`)
  }
 }


module.exports = {
  // findOneFolder,
  createFolder,
  createFile,
  findFolderChilds,
  findFolder
}