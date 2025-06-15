const staffModel = require("../Models/StaffModel");
const jwt = require("jsonwebtoken");

const staffMiddleware = async (req, res, next) => {
    try {
        if(req.headers?.authorization?.startsWith("Bearer")) {
            let token = req.headers.authorization.split(" ")[1]
            let decode = jwt.verify(token, "staff_eka");
            const staff = await staffModel.findById(decode.staff);
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

module.exports = {
    staffMiddleware
}