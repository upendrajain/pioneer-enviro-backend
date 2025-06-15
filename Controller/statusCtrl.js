const statusModel = require("../Models/statusModel")


const AddStatus = async(req,res,next)=>{
    try{
        const Status = await statusModel.findOne({$or: [{name:req.body.name}]})
        if(Status){
            res.status(200).json({
                exists :true,
                message:"Already Exists",
                data: Status
            });
        }
        const newStatus = await statusModel.create(req.body);
        res.status(200).json({
            error: false,
            exists :false,
            message:"Created",
            data: newStatus
        });
        next();

    }catch(error){
        res.status(200).json({
            error:true,
            message:error.message,
            data: {}
        });
    }
};


const updateStatus = async (req, res, next) => {
    try {
        const Status = await statusModel.findByIdAndUpdate(req.params.id, req.body);
        if(!Status) throw new Error("Status not found!");
        res.json({
            error: false,
            message: "Status Update Successfully!",
            data: Status
        })
    }
    catch(error) {
        res.json({
            error:true,
            message:error.message,
            data: Status
        });        
    }
}

const deleteStatus = async (req, res, next) => {
    try {
        const Status = await statusModel.findByIdAndDelete(req.params.id);
        if(!Status) throw new Error("Employee not found!");
        res.json({
            error: false,
            message: "Status Update Successfully!",
            data: Status
        })
    }
    catch(error) {
        res.json({
            error:true,
            message:error.message,
            data: Status
        });        
    }
}

const getStatus = async (req, res, next) => {
    try {
        const [Status, totalCount] = await Promise.all([
            statusModel.find().skip(req.query.page*req.query.count).limit(req.query.count),
            statusModel.countDocuments(),
        ]);
        res.json({
            error: false,
            message: "Data fetched successfully!",
            data: Status,
            totalCount
        })
    }
    catch(error) {
        res.json({
            error: true,
            message: error.message,
        })
    }
}

const getStatusById = async (req, res, next) => {
    try {
        const Status = await statusModel.findById(req.params.id);
        res.json({
            error: false,
            message: "Data fetched successfully!",
            data: Status,
            totalCount
        })
    }
    catch(error) {
        res.json({
            error: true,
            message: error.message,
        })
    }
}


module.exports = {
    AddStatus,
    updateStatus,
    deleteStatus,
    getStatus,
    getStatusById
}