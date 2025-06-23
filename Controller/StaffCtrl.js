const mongoose = require("mongoose")
const StaffModel = require("../Models/StaffModel")
const jwt = require("jsonwebtoken")

// const AddStaff = async(req,res,next)=>{
//     try{
//         const Staff = await StaffModel.findOne({email:req.body.email.toLowerCase()})
//         if(Staff){
//             res.status(200).json({
//                 exists :true,
//                 message:"Exists",
//                 data: Staff
//             });
//         }

//         req.body.email = req.body.email.toLowerCase();
//         const newStaff = await StaffModel.create(req.body);
//         res.status(200).json({
//             error: false,
//             exists :false,
//             message:"Created",
//             data: newStaff
//         });
//         next();

//     }catch(error){
//         res.status(200).json({
//             error:true,
//             message:error.message,
//             data: {}
//         });
//     }
// };

const AddStaff = async (req, res) => {
  try {
    const { email } = req.body;

    const existingStaff = await StaffModel.findOne({ email: email.toLowerCase() });
    if (existingStaff) {
      return res.status(200).json({
        exists: true,
        message: "Staff already exists",
        data: existingStaff,
      });
    }

    // Lowercase email
    req.body.email = email.toLowerCase();

    // Save uploaded file path
    if (req.file) {
      req.body.Profile = `/uploads/staff/${req.file.filename}`;
    }

    // Set createdBy from middleware (req.staff)
    req.body.createdBy = req.staff_id;

    const newStaff = await StaffModel.create(req.body);

    res.status(200).json({
      error: false,
      exists: false,
      message: "Staff created successfully",
      data: newStaff,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      data: {},
    });
  }
};


const login = async (req, res, next) => {
  try {
    const user = await StaffModel.findOne({ email: req.body.email.toLowerCase() })
      .populate("role_id");

    if (user && !user.isActive) {
      throw new Error("Sorry, your credentials are blocked!");
    }

    if (user) {
      const isMatch = await user.isPasswordMatched(req.body.password);
      if (!isMatch) throw new Error("Password not matched!");

      res.json({
        error: false,
        message: "Staff login successfully!",
        token: jwt.sign({ staff: user._id }, "staff_eka"),
        name: user.name,
        email: user.email,
        profile: user.Profile,
        role: user.role_id?.name || null, // 👈 safely access role name
        isActive: user.isActive,
      });
    } else {
      res.status(200).json({
        exists: false,
        message: "Either email or password is wrong.",
      });
    }

  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};

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

// const getStaff = async (req, res, next) => {
//     try {
//         const [staff, totalCount] = await Promise.all([
//             StaffModel.find().skip(req.query.page*req.query.count).limit(req.query.count),
//             StaffModel.countDocuments(),
//         ]);
//         res.json({
//             error: false,
//             message: "Data fetched successfully!",
//             data: staff,
//             totalCount
//         })
//     }
//     catch(error) {
//         res.json({
//             error: true,
//             message: error.message,
//         })
//     }
// }

const getStaff = async (req, res, next) => {
  try {
    const { page = 0, count = 10 } = req.query;

    const filter = {
      createdBy: req.staff_id  // 👈 Logged-in staff ka ID
    };

    const [staff, totalCount] = await Promise.all([
      StaffModel.find(filter)
        .skip(page * count)
        .limit(Number(count)),
      StaffModel.countDocuments(filter),
    ]);

    res.json({
      error: false,
      message: "Data fetched successfully!",
      data: staff,
      totalCount,
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};


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

const getProfile = async (req, res) => {
  try {
    const userId = req.staff_id; // from JWT middleware
    console.log(userId)

    const user = await StaffModel.findById(userId)
      .select("-password") // Don't send password
      .populate("role_id", "name permissions"); // Optional: populate role details

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ data: user });
  } catch (err) {
    console.error("GET /profile error", err);
    res.status(500).json({ message: "Server error." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.staff_id;
    const updates = req.body;

    // Prevent updates to restricted fields
    delete updates.password;
    delete updates.email; // if email should not be changeable
    delete updates.role_id;

    const updatedUser = await StaffModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ profile: updatedUser });
  } catch (err) {
    console.error("PUT /profile error", err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
    AddStaff,
    login,
    updateStaff,
    deleteStaff,
    getStaff,
    changePassword,
    getStaffById,
    getProfile,
    updateProfile 
}