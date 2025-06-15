const mongoose = require("mongoose")
const projectIssueModel = require("../Models/projectIssueModel")
const jwt = require("jsonwebtoken")

const AddProjectIssue = async(req,res,next)=>{
    try{
        const ProjectIssue = await projectIssueModel.findOne({_id:req.body.project_id})
        if(ProjectIssue){
            return res.status(200).json({
                exists :true,
                message:"Exists",
                data: ProjectIssue
            });
        }
        req.body.staff_id = req.staff_id;
        const newProjectIssue = await projectIssueModel.create(req.body);
        res.status(200).json({
            error: false,
            exists :false,
            message:"Created",
            data: newProjectIssue
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

const updateProjectIssue = async (req, res, next) => {
    try {
        const ProjectIssue = await projectIssueModel.findByIdAndUpdate(req.params.id, req.body);
        if(!ProjectIssue) throw new Error("Employee not found!");
        res.json({
            error: false,
            message: "ProjectIssue Update Successfully!",
            data: ProjectIssue
        })
    }
    catch(error) {
        res.json({
            error:true,
            message:error.message,
            data: ProjectIssue
        });        
    }
}

const deleteProjectIssue = async (req, res, next) => {
    try {
        const ProjectIssue = await projectIssueModel.findByIdAndDelete(req.params.id);
        if(!ProjectIssue) throw new Error("Employee not found!");
        res.json({
            error: false,
            message: "ProjectIssue Update Successfully!",
            data: ProjectIssue
        })
    }
    catch(error) {
        res.json({
            error:true,
            message:error.message,
            data: ProjectIssue
        });        
    }
}

const getProjectIssue = async (req, res, next) => {
    try {
        const [ProjectIssue, totalCount] = await Promise.all([
            projectIssueModel.find().skip(req.query.page*req.query.count).limit(req.query.count),
            projectIssueModel.countDocuments(),
        ]);
        res.json({
            error: false,
            message: "Data fetched successfully!",
            data: ProjectIssue,
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

const getProjectIssueById = async (req, res, next) => {
    try {
        const ProjectIssue = await projectIssueModel.findById(req.params.id);
        res.json({
            error: false,
            message: "Data fetched successfully!",
            data: ProjectIssue,
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
    AddProjectIssue,
    updateProjectIssue,
    deleteProjectIssue,
    getProjectIssue,
    getProjectIssueById
}