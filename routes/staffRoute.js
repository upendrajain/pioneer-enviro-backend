const router = require("express").Router();

const { getStaff, getStaffById, updateStaff, deleteStaff, AddStaff, login, getProfile, updateProfile  } = require("../Controller/StaffCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware")

const upload = require("../utils/multer");

router.get("/get", staffMiddleware, getStaff);
router.get("/get/:id", staffMiddleware, getStaffById);
router.post("/add", staffMiddleware,upload.single("Profile"), AddStaff)
router.put("/update/:id", staffMiddleware, updateStaff)
router.delete("/delete/:id", staffMiddleware, deleteStaff)
router.post("/login", login)
router.get("/profile", staffMiddleware, getProfile);
router.put("/update-profile", staffMiddleware, updateProfile);

module.exports = router;