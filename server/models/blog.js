const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle:{
    type:String,
    // required:true
  },
  content: {
    type: String,
    required: true,
  },
  author:{
    type:String,

  },
  image:{
    type:String
  },
  subFooterTitle:{
    type:String
  },
  createdAt:{
    type:Date
  }
  
},{timeStamps:true});
const blog=mongoose.model('Blog',blogSchema)
module.exports=blog