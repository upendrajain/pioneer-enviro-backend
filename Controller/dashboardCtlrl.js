const statusModel = require("../Models/statusModel");
const projectModel = require("../Models/projectModel");

const adminDashboard = async (req, res, next) => {
    try {
        const [totalProjects, statusWiseProject] = await Promise.all([
            projectModel.countDocuments(),
            statusModel.aggregate([
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $lookup: {
                        from: "projects",
                        localField: "_id",
                        foreignField: "status",
                        as: "counts"
                    }
                },
                {
                    $addFields: {
                        count: { $size: "$counts" }
                    }
                }
            ])
        ])
        res.json({
            error: true,
            message: "Data fetched",
            data: { totalProjects, statusWiseProject }
        })
    }
    catch(error) {
        res.json({
            error:true,
            message: error.message
        })
    }
}

module.exports = {
    adminDashboard
}