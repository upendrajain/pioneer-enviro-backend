const statusModel = require("../Models/statusModel");
const projectModel = require("../Models/projectModel");
const clientModel = require("../Models/clientModel");
const staffModel = require("../Models/StaffModel");

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

const clientCount = async (req, res) => {
    console.log("client count")
  try {
    const count = await clientModel.countDocuments({ isActive: true });
    res.json({ totalActiveClient:count });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const employeeCount = async (req, res) => {
  try {
    const count = await staffModel.countDocuments({
      staff_id: req.staff_id,
      isActive: true
    });
    res.json({ totalActiveEmployee: count });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const dashboardSummary = async (req, res) => {
  try {
    const [clientCount, pending, approved, active] = await Promise.all([
      clientModel.countDocuments({ isActive: true }),
      projectModel.countDocuments({ status: await getStatusId("Pending") }),
      projectModel.countDocuments({ status: await getStatusId("Approved") }),
      projectModel.countDocuments({ status: await getStatusId("Active") })
    ]);

    res.json({
      totalActiveClient: clientCount,
      projects: {
        pending,
        approved,
        active
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

const getStatusId = async (statusName) => {
  const status = await statusModel.findOne({ name: statusName.toLowerCase() });
  return status?._id;
};

module.exports = {
    adminDashboard,
    clientCount,
    employeeCount,
    dashboardSummary
}