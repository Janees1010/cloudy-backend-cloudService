const Folder = require("../models/folderSchema");
const File = require("../models/fileSchema");


const findOneFolder = async(name,userId)=>{
    try {
        const folder = await Folder.findOne({name,userId})
        return folder
    } catch (error) {
        throw new Error("error finding folder " + error.message)
    }
}

const createFolder = async(name,parentId,userId)=>{
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
   } catch (error) {
     throw new Error("error wfile creating file" + error.message)
   }
}

const findFolderChilds = async(data)=>{
 try {
  
    let {userId,parentId} = data;
    parentId = parentId === "null" ? null : parentId; 
 
    const files   = await File.find({userId,parentId})
    const folders = await Folder.find({userId,parentId}) 
    
    const childrens = [
      ...files.map(file => ({ childrenType: 'file', ...file.toObject() })),
      ...folders.map(folder => ({ childrenType: 'folder', ...folder.toObject() }))
  ];
    return childrens
 } catch (error) {
    throw new Error(`error while fetching folder childs : ${error.message}`)
 }
}

const findFolders = async(userId)=>{
  try {
     const folders = await Folder.find({userId,parentId:null})
     return folders
  } catch (error) {
    throw new Error(`error while fetching folder : ${error.message}`)
  }
 }

module.exports = {
  findOneFolder,
  createFolder,
  createFile,
  findFolderChilds,
  findFolders
}