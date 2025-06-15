const router = require("express").Router();

const { getStaff, getStaffById, updateStaff, deleteStaff, AddStaff } = require("../Controller/clientCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware")


router.get("/get", staffMiddleware, getStaff);
router.get("/get/:id", staffMiddleware, getStaffById);
router.post("/add", staffMiddleware, AddStaff)
router.put("/update/:id", staffMiddleware, updateStaff)
router.delete("/delete/:id", staffMiddleware, deleteStaff)

module.exports = router;