const mongoose = require("mongoose")

const SettingModel = new mongoose.Schema({
    smtpHostt:{type:String,required:true},
    smtpPort:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},


    aws_secret_key: { type: String },
    aws_access_key: { type: String },
    region: { type: String },
    bucket: { type: String },

    service: { type: String },
      
})

module.exports = mongoose.model("SettingModel",SettingModel)
