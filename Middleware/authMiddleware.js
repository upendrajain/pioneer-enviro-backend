const staffModel = require("../Models/StaffModel");
const jwt = require("jsonwebtoken");

const staffMiddleware = async (req, res, next) => {
    try {
        if(req.headers?.authorization?.startsWith("Bearer")) {
            let token = req.headers.authorization.split(" ")[1]
            let decode = jwt.verify(token, "staff_eka");
            const staff = await staffModel.findById(decode.staff).populate("role_id");
            console.log(staff);
            if(!staff) throw new Error("Sorry Your session has expired. Please Login first")
            if(!staff.isActive) throw new Error("Sorry You are blocked for performing any action please contact admin first!");
            req.staff_id = staff;
            next();
            }
        else {
            throw new Error("Please login first!")
        }
    }
    catch(error) {
        
        res.json({
            error: true,
            message: error.message
        })
    }
}

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.staff_id?.role_id?.name; // Ensure Role model has 'name' field

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. Unauthorized role." });
    }

    next();
  };
};

const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.staff_id?.role_id?.permissions || [];

    const hasPermission = requiredPermissions.every(p =>
      userPermissions.includes(p)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};

module.exports = {
    staffMiddleware,
    authorizeRoles
}