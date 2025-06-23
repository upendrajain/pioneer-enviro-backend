const router = require("express").Router();

const { AddUser, Checking, listUser, updateProjectDetailsByMember, listUserById,projectDetailsById, deleteProjectById, updateProjectDetailsByStaff  } = require("../Controller/projectCtrl");
const { staffMiddleware, authorizeRoles } = require("../Middleware/authMiddleware")
const {responseSend} = require("../utils/response")

router.get("/get", staffMiddleware, Checking);
router.get("/list", staffMiddleware, authorizeRoles("admin","staff"), listUser);
router.post("/add", staffMiddleware, AddUser, responseSend);
router.put("/update", updateProjectDetailsByMember);
router.get("/list/get", listUserById);
router.get("/project-details", staffMiddleware, projectDetailsById);
router.delete("/delete/:projectId", staffMiddleware, deleteProjectById);
router.put("/update/:projectId", staffMiddleware, updateProjectDetailsByStaff);

module.exports = router;