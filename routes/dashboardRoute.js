const router = require("express").Router()
const {staffMiddleware} = require("../Middleware/authMiddleware")
const {responseSend} = require("../utils/response")

const { adminDashboard, clientCount, employeeCount, dashboardSummary } = require("../Controller/dashboardCtlrl")

router.get("/admin", adminDashboard);

router.get('/client/count', staffMiddleware, clientCount, responseSend);

router.get('/dashboard-summary', staffMiddleware, dashboardSummary, responseSend);

router.get('/employee/count', staffMiddleware, employeeCount, responseSend);

module.exports = router;