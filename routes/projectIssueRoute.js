const router = require("express").Router();

const { getProjectIssue, getProjectIssueById, updateProjectIssue, deleteProjectIssue, AddProjectIssue,  } = require("../Controller/projectIssueCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware")


router.get("/get", staffMiddleware, getProjectIssue);
router.get("/get/:id", staffMiddleware, getProjectIssueById);
router.post("/add", staffMiddleware, AddProjectIssue)
router.put("/update/:id", staffMiddleware, updateProjectIssue)
router.delete("/delete/:id", staffMiddleware, deleteProjectIssue)
// router.post("/login", login)

module.exports = router;