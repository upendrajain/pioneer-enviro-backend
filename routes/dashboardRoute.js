const router = require("express").Router()
const {staffMiddleware} = require("../Middleware/authMiddleware")

const { adminDashboard } = require("../Controller/dashboardCtlrl")

router.get("/admin", adminDashboard);

module.exports = router;