const router = require("express").Router();

const { AddUser, Checking, listUser, updateProjectDetailsByMember, listUserById } = require("../Controller/projectCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware")
const {responseSend} = require("../utils/response")

router.get("/get", staffMiddleware, Checking);
router.get("/list", staffMiddleware, listUser);
router.post("/add", staffMiddleware, AddUser, responseSend);
router.put("/update", updateProjectDetailsByMember);
router.get("/list/get", listUserById);

module.exports = router;