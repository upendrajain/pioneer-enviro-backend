const router = require("express").Router();

const { getSetting, updateSetting } = require("../Controller/settingCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware")

router.get("/get", staffMiddleware, getSetting);
router.put("/update", staffMiddleware, updateSetting)

module.exports = router;