const mongoose = require("mongoose");

const ProjectModel = new mongoose.Schema({
    project_name: { type: String,  },
    Address:{
        Village:{type:String, },
        Tahsil:{type:String, },
        District:{type:String, },
        State:{type: mongoose.Schema.Types.ObjectId, ref: 'state', index: true, },
        City:{type: mongoose.Schema.Types.ObjectId, ref: 'city', index: true,},
        Country:{type: mongoose.Schema.Types.ObjectId, ref: 'country', index: true,},        
    },
    location: {
        type: {
          type: String,
          enum: ['Point'], // Only 'Point' allowed
        },
        coordinates: {
          type: [Number],  // [longitude, latitude]
        }
    },
    Capacity:[{
        Product:{type:String},
        Production:{type:Number}
    }],

    Configuration:[{
        Keys:{type:String},
        Values:{type:Number}
    }],
    ExtendLand:{type:Number},
    Khasra:{type:String},
    Survey:{type:String},

    LandUse:{type:String,enum:["agr","non-Agri","indus","forest","govt","Others"]},
    WaterSource:{
        ispassing:{type:Boolean},
        inLand:{type:Boolean}
    },

    StatusofAqua:{type:String,enum:["Acq","Sale Agree","yet to Acq"]},
    LandDoc:{
        isSumbmitted:{type:Boolean},
        isVerified:{type:Boolean}
    },
    

    Communication:{
        Name:{type:String,},
        Mobile:{type:String},
        Phone:{type:String},
        Email:{type:String} 
    },
    RawMaterials:[{type:String}],

    PowerPlant:{
        Cpacity:{type:Number},
        FuelType:{type:String},
        FuelReq:{type:Number}
    },

    ManPower:{type:Number},
    PowerReq:{
        Req:{type:Number},
        Source:{type:String}
    },
    BoardDir:[{name:{type:String}}],
    Background:{type:String},
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'status' },
    staff_id:{type:mongoose.Types.ObjectId,ref:"StaffModel"},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'clientModel', index: true }
    
},
{
    timestamps:true
})

module.exports = mongoose.model("project",ProjectModel);
