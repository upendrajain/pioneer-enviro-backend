const router = require("express").Router();

const { getRole  } = require("../Controller/RoleCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware")


router.get("/get", staffMiddleware, getRole);
// router.get("/get/:id", staffMiddleware, getRoleById);
// router.post("/add", staffMiddleware, AddRole)
// router.put("/update/:id", staffMiddleware, updateRole)
// router.delete("/delete/:id", staffMiddleware, deleteRole)

module.exports = router;