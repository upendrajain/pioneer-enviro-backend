const projectModel = require("../Models/projectModel");
const settingModel = require("../Models/SettingModel");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const cron = require("node-cron");
const statusModel = require("../Models/statusModel");

const Checking = async (req, res, next) => {
  try {
    const Checkuser = await projectModel.findOne({
      $or: [{ Khasra: req.query.Khasra }, { Survey: req.query.Survey }],
    });

    if (Checkuser) {
      res.status(200).json({
        exists: true,
        message: "record exists",
        data: Checkuser,
      });
    } else {
      res.status(200).json({
        exists: false,
        message: "No match found. Record for Confirmation",
      });
    }
    next();
  } catch (error) {
    res.status(200).json({
      error: true,
      message: error.message,
      data: {},
    });
    next();
  }
};

const AddUser = async (req, res, next) => {
  try {
    const User = await projectModel.findOne({
      $or: [{ Khasra: req.body.Khasra }, { Survey: req.body.Survey }],
    });
    if (User) {
      return res.status(200).json({
        exists: true,
        message: "Record already exists",
        // data: User,
      });
    }

    req.body.staff_id = req.staff_id;
    const pendingStatus = await statusModel.findOne({ name: "pending" });
    req.body.status = pendingStatus._id;

    const newUser = await projectModel.create(req.body);

    // const emailCred = await settingModel.findOne({ companyId: req.companyId });
    const emailCred = await settingModel.findOne();
    let config = {
      service: emailCred.service,
      host: emailCred.smtpHostt,
      port: emailCred.smtpPort,
      secure: false,
      auth: {
        user: emailCred.email,
        pass: emailCred.password,
      },
    };
    const transporter = nodemailer.createTransport(config);
    let data = {
      from: emailCred.email,
      to: req.body.Communication.Email,
      subject: "Request for Complete Project Details",
      text: `
            Dear ${req.body.Communication.Name},

Greetings of the day!

Thank you for reaching out to us. To proceed further, we kindly request you to share the complete details of your project. This will help us better understand your requirements and provide you with the most accurate support.

Please share the project description using the following link:
https://pioneer-enviro-2.web.app/client-form?token=${jwt.sign(
        {
          project: newUser._id,
        },
        "project_id"
      )}

We look forward to reviewing your input and collaborating with you on your project.

Best regards,  
[Your Full Name]  
[Your Position]  
[Your Company Name]  
[Contact Information]
`,
    };
    transporter.sendMail(data, async (err, info) => {
      if (err) {
        //                const save = await typeModel.create(data)
        // res.data = {
        //     token: jwt.sign(
        //     {
        //       project: newUser._id
        //     },
        //     "project_id"
        //   ),
        // };
        console.error("Mail Error:", err);
        res.error = true;
        res.message = err.message;
        res.status_Code = 500;
        return next();

        //              throw new Error(err.message);
      } else {
        req.body.createdBy = req.staff_id;
        req.body.updatedBy = req.staff_id;
        // const save = await typeModel.create(req.body);
        res.data = {
          token: jwt.sign(
            {
              project: newUser._id
            },
            "project_id"
          ),
        };
        res.message = "Mail send successfully!";
        res.status_Code = 200;
        return next();
      }
    });

    // return res.status(200).json({
    //   exists: true,
    //   message: "Project saved successfully!",
    //   data: {newUser,token: jwt.sign(
    //         {
    //           project: newUser._id
    //         },
    //         "project_id"
    //       )}
    // });
    next();
  } catch (error) {
    res.status(200).json({
      error: true,
      message: error.message,
      data: {},
    });
    next();
  }
};

const listUser = async (req, res, next) => {
  try {
    const { project_name, city, state, country, status, page, count } = req.query;
    let filter = {};
    if (project_name) {
      filter = { project_name: new RegExp(project_name, 'i') }
    }
    // if (city) {
    //   filter = { ...filter, city }
    // }
    // if (state) {
    //   filter = { ...filter, state }
    // }
    // if (country) {
    //   filter = { ...filter, country }
    // }
     if (city) {
      filter["Address.City"] = city;
    }

    if (state) {
      filter["Address.State"] = state;
    }

    if (country) {
      filter["Address.Country"] = country;
    }
    const data = await projectModel.find(filter).skip(page * count).limit(count).select("project_name user_id staff_id Address createdAt").populate('user_id staff_id', "name").populate('Address.Country', 'name')
  .populate('Address.State', 'name')
  .populate('Address.City', 'name')
  .populate('status','name');
    res.json({
      error: false,
      message: "Data fetched successfully",
      data
    })
  }
  catch (error) {
    res.json({
      error: true,
      message: error.message
    })
  }
}

const listUserById = async (req, res, next) => {
  try {
    const { token }= req.query;
    console.log(token)
    const decoded = jwt.verify(token, "project_id");
    const projectId = decoded.project;
    const data = await projectModel.findById(projectId).populate('user_id staff_id', "name");
    console.log(data);
    res.json({
      error: false,
      message: "Data fetched successfully",
      data
    })
  }
  catch (error) {
    res.json({
      error: true,
      message: error.message
    })
  }
}

const projectDetailsById = async (req, res, next) => {
  try {
    const { token }= req.query;
    // const decoded = jwt.verify(token, "project_id");
    // const projectId = decoded.project;
    const data = await projectModel.findById(token).populate('user_id staff_id status', "name");
    console.log(data);
    res.json({
      error: false,
      message: "Data fetched successfully",
      data
    })
  }
  catch (error) {
    res.json({
      error: true,
      message: error.message
    })
  }
}

const deleteProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await projectModel.findByIdAndDelete(projectId);

    if (!data) {
      return res.status(404).json({
        error: true,
        message: "Project not found",
      });
    }

    res.json({
      error: false,
      message: "Data deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};



const updateProjectDetailsByMember = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let decode = jwt.verify(token, "project_id");
    console.log("Decoded JWT:", decode.project);
    console.log("Request Body:", req.body);
    const project = await projectModel.findById(decode.project);
    if (!project)
      throw new Error("Sorry Your session has expired. Please Login first");
    // if (project.status != "Approved")
    //   throw new Error(
    //     "Sorry You are not allowed for performing any action please contact admin!"
    //   );
    await projectModel.findByIdAndUpdate(decode.project, { $set: req.body.formData },
      { new: true });

    res.json({
      error: false,
      message: "Project Details Uploaded Successfully!",
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};

// const updateProjectDetailsByStaff = async (req, res) => {
//   try {
//     const{ projectId } = req.params;
//     const { formData } = req.body;

//     const project = await projectModel.findById(projectId);
//     if (!project) {
//       return res.status(401).json({
//         error: true,
//         message: "Session expired or project not found.",
//       });
//     }

//     // Add staff_id to formData
//     const updatedData = {
//       ...formData,
//       staff_id: req.staff_id,
//     };

//     await projectModel.findByIdAndUpdate(
//       projectId,
//       { $set: updatedData },
//       { new: true }
//     );

//     res.json({
//       error: false,
//       message: "Project details updated successfully.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: true,
//       message: error.message,
//     });
//   }
// };


const updateProjectDetailsByStaff = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { formData } = req.body;

    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(401).json({
        error: true,
        message: "Session expired or project not found.",
      });
    }

    // 🟡 Step 1: Find status ID if status name is passed in formData
    let statusId = null;
    if (formData.status) {
      const statusDoc = await statusModel.findOne({ name: formData.status });
      if (!statusDoc) {
        return res.status(400).json({
          error: true,
          message: "Invalid status provided.",
        });
      }
      statusId = statusDoc._id;
    }

    // 🟢 Step 2: Prepare update object
    const updatedData = {
      ...formData,
      status: statusId, // Replace status name with ObjectId
      staff_id: req.staff_id,
    };

    await projectModel.findByIdAndUpdate(
      projectId,
      { $set: updatedData },
      { new: true }
    );

    res.json({
      error: false,
      message: "Project details updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const getIncompleteFields = (project) => {
  const missingFields = [];

  // Basic Details
  if (!project.project_name) missingFields.push("Project Name");

  // Address
  if (!project.Address?.Village) missingFields.push("Address: Village");
  if (!project.Address?.Tahsil) missingFields.push("Address: Tahsil");
  if (!project.Address?.District) missingFields.push("Address: District");
  if (!project.Address?.State) missingFields.push("Address: State");
  if (!project.Address?.City) missingFields.push("Address: City");
  if (!project.Address?.Country) missingFields.push("Address: Country");

  // Location
  if (
    !project.location ||
    project.location.type !== "Point" ||
    !Array.isArray(project.location.coordinates) ||
    project.location.coordinates.length !== 2 ||
    project.location.coordinates.includes(null)
  ) {
    missingFields.push("Location (Coordinates)");
  }

  // Capacity
  if (!Array.isArray(project.Capacity) || project.Capacity.length === 0) {
    missingFields.push("Capacity");
  } else {
    project.Capacity.forEach((cap, index) => {
      if (!cap.Product || cap.Production == null) {
        missingFields.push(`Capacity [${index + 1}]`);
      }
    });
  }

  // Configuration
  if (!Array.isArray(project.Configuration) || project.Configuration.length === 0) {
    missingFields.push("Configuration");
  } else {
    project.Configuration.forEach((conf, index) => {
      if (!conf.Keys || conf.Values == null) {
        missingFields.push(`Configuration [${index + 1}]`);
      }
    });
  }

  // Land Details
  if (project.ExtendLand == null) missingFields.push("ExtendLand");
  if (!project.Khasra) missingFields.push("Khasra");
  if (!project.Survey) missingFields.push("Survey");
  if (!project.LandUse) missingFields.push("Land Use");

  // Water Source
  if (project.WaterSource?.ispassing == null) missingFields.push("Water Source: ispassing");
  if (project.WaterSource?.inLand == null) missingFields.push("Water Source: inLand");

  // Land Acquisition Status
  if (!project.StatusofAqua) missingFields.push("Status of Acquisition");

  // Land Document
  if (project.LandDoc?.isSumbmitted == null) missingFields.push("LandDoc: isSubmitted");
  if (project.LandDoc?.isVerified == null) missingFields.push("LandDoc: isVerified");

  // Communication
  if (!project.Communication?.Name) missingFields.push("Communication: Name");
  if (!project.Communication?.Mobile) missingFields.push("Communication: Mobile");
  if (!project.Communication?.Phone) missingFields.push("Communication: Phone");
  if (!project.Communication?.Email) missingFields.push("Communication: Email");

  // Raw Materials
  if (!project.RawMaterials || !project.RawMaterials.length) missingFields.push("Raw Materials");

  // Power Plant
  if (project.PowerPlant?.Cpacity == null) missingFields.push("PowerPlant: Capacity");
  if (!project.PowerPlant?.FuelType) missingFields.push("PowerPlant: Fuel Type");
  if (project.PowerPlant?.FuelReq == null) missingFields.push("PowerPlant: Fuel Requirement");

  // Man Power
  if (project.ManPower == null) missingFields.push("Man Power");

  // Power Requirement
  if (project.PowerReq?.Req == null) missingFields.push("Power Requirement: Req");
  if (!project.PowerReq?.Source) missingFields.push("Power Requirement: Source");

  // Board of Directors
  if (!Array.isArray(project.BoardDir) || project.BoardDir.length === 0) {
    missingFields.push("Board of Directors");
  } else {
    project.BoardDir.forEach((dir, i) => {
      if (!dir.name) missingFields.push(`BoardDir [${i + 1}]: name`);
    });
  }

  // Background
  if (!project.Background) missingFields.push("Background");

  // References
  if (!project.staff_id) missingFields.push("Staff ID");
  if (!project.user_id) missingFields.push("User ID");

  return missingFields;
};

const sendReminderEmail = async () => {
  const projects = await projectModel.find().populate("user_id"); // Ensure user email is populated

  for (const project of projects) {
    const missingFields = getIncompleteFields(project);
    if (missingFields.length && project.Communication?.Email) {
      const emailText = `
        Hello ${project.Communication.Name || "User"},
        
        Your project "${project.project_name || "(No Name)"}" is missing the following details:
        
        ${missingFields.map(f => `- ${f}`).join("\n")}

        Please share the project description using the following link:
        https://pioneer-enviro-2.web.app/client-form?token=${jwt.sign(
        {
          project: project._id,
        },
        "project_id"
      )}

        Please update your project at your earliest convenience.
        
        Regards,
        Pioneer Enviro Labs
      `;

      const emailCred = await settingModel.findOne();
      let config = {
        service: emailCred.service,
        host: emailCred.smtpHostt,
        port: emailCred.smtpPort,
        secure: false,
        auth: {
          user: emailCred.email,
          pass: emailCred.password,
        },
      };
      const transporter = nodemailer.createTransport(config);
      console.log(transporter)
      console.log()

      await transporter.sendMail({
        from: '"Pioneer Enviro Labs" <no-reply@pioneer.com>',
        to: project.Communication.Email,
        subject: 'Incomplete Project Details Reminder',
        text: emailText
      });

      console.log(`Reminder sent to ${project.Communication.Email}`);
    }
  }
};

cron.schedule("0 10 * * *", async () => {
  console.log("Running daily reminder check...");
  await sendReminderEmail();
});

module.exports = {
  AddUser,
  Checking,
  listUser,
  updateProjectDetailsByMember,
  listUserById,
  projectDetailsById,
  deleteProjectById,
  updateProjectDetailsByStaff
}