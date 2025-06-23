const mongoose = require("mongoose")
const rolemodels = require("../Models/RoleModel")

const addroles = async(req,res,next)=>{
    try{
        const user = await rolemodels.findOne()
    }catch(error){

    }

}

const getRole = async(req,res,next)=>{
    try{
        const user = await rolemodels.findOne()
    }catch(error){

    }

}


module.exports = {
  getRole
}