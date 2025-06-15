const router = require("express").Router();

const { getStatus, getStatusById, updateStatus, deleteStatus, AddStatus,  } = require("../Controller/statusCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware")


router.get("/get", staffMiddleware, getStatus);
router.get("/get/:id", staffMiddleware, getStatusById);
router.post("/add", staffMiddleware, AddStatus)
router.put("/update/:id", staffMiddleware, updateStatus)
router.delete("/delete/:id", staffMiddleware, deleteStatus)

module.exports = router;