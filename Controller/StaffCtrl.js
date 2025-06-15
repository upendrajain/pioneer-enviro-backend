const mongoose = require("mongoose")
const StaffModel = require("../Models/StaffModel")
const jwt = require("jsonwebtoken")

const AddStaff = async(req,res,next)=>{
    try{
        const Staff = await StaffModel.findOne({email:req.body.email.toLowerCase()})
        if(Staff){
            res.status(200).json({
                exists :true,
                message:"Exists",
                data: Staff
            });
        }

        req.body.email = req.body.email.toLowerCase();
        const newStaff = await StaffModel.create(req.body);
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

const login = async(req,res,next) =>{
    try{
        const user = await StaffModel.findOne({email:req.body.email.toLowerCase()})
        if(user && !user.isActive) throw new Error("Sorry your credentials are blocked!");
        if(user){
            let isMatch = await user.isPasswordMatched(req.body.password)
            if(!isMatch) throw new Error("Password not matched!");
            res.json({
                error: false,
                message: "Staff Login successfully!",
                token: jwt.sign({ staff: user._id }, "staff_eka"),
                name: user.name,
                profile: user.Profile,
                isActive: user.isActive
            });
        }else{
            res.status(200).json({
                exists:false,
                message:"Either emailId or password is wrong."  
            })
        }

    }catch(error){
        
        res.json({
            error:true,
            message:error.message,        
        });
    }
}

const updateStaff = async (req, res, next) => {
    try {
        const staff = await StaffModel.findByIdAndUpdate(req.params.id, req.body);
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
        const staff = await StaffModel.findByIdAndDelete(req.params.id);
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
            StaffModel.find().skip(req.query.page*req.query.count).limit(req.query.count),
            StaffModel.countDocuments(),
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
        const staff = await StaffModel.findById(req.params.id);
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

const changePassword = async (req, res, next) => {
    try {
        const staff = await StaffModel.findById(req.staff);
        if(req.body.password != req.body.confirmPassword) throw new Error("Password and confirm Password must be same");
        staff.password = req.body.password
        await staff.save();

        res.json({
            error: false,
            message: "Password updated Successfully!"
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
    login,
    updateStaff,
    deleteStaff,
    getStaff,
    changePassword,
    getStaffById
}