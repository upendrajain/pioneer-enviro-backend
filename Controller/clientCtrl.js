const clientModel = require("../Models/clientModel")

const uniqueId = async () => {
    try {
        let random = Math.floor(Math.random() * 10000);
        const search = await clientModel.findOne({ refer_id: random });
        if(search) {
            return uniqueId()
        }
        else {
            return random;
        }
    }
    catch(error) {
        throw new Error("Sorry Something went wrong please try again")
    }
}

const AddStaff = async(req,res,next)=>{
    try{
        req.body.refer_id = await uniqueId();
        const Staff = await clientModel.findOne({$or: [{email:req.body.email.toLowerCase()}, {contact: req.body.contact}]})
        if(Staff){
            res.status(200).json({
                exists :true,
                message:"Already Exists",
                data: Staff
            });
        }
        req.body.staff_id = req.staff_id;
        req.body.email = req.body.email.toLowerCase();
        const newStaff = await clientModel.create(req.body);
        res.status(200).json({
            error: false,
            exists :false,
            message:"Created",
            data: newStaff
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


const updateStaff = async (req, res, next) => {
    try {
        const staff = await clientModel.findByIdAndUpdate(req.params.id, req.body);
        if(!staff) throw new Error("Employee not found!");
        res.json({
            error: false,
            message: "Staff Update Successfully!",
            data: staff
        })
    }
    catch(error) {
        res.json({
            error:true,
            message:error.message,
            data: Staff
        });        
    }
}

const deleteStaff = async (req, res, next) => {
    try {
        const staff = await clientModel.findByIdAndDelete(req.params.id);
        if(!staff) throw new Error("Employee not found!");
        res.json({
            error: false,
            message: "Staff Update Successfully!",
            data: staff
        })
    }
    catch(error) {
        res.json({
            error:true,
            message:error.message,
            data: Staff
        });        
    }
}

const getStaff = async (req, res, next) => {
    try {
        const [staff, totalCount] = await Promise.all([
            clientModel.find().skip(req.query.page*req.query.count).limit(req.query.count),
            clientModel.countDocuments(),
        ]);
        res.json({
            error: false,
            message: "Data fetched successfully!",
            data: staff,
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

const getStaffById = async (req, res, next) => {
    try {
        const staff = await clientModel.findById(req.params.id);
        res.json({
            error: false,
            message: "Data fetched successfully!",
            data: staff,
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
    AddStaff,
    updateStaff,
    deleteStaff,
    getStaff,
    getStaffById
}