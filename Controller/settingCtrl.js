const settingModel = require("../Models/SettingModel");

const updateSetting = async (req, res, next) => {
    try {
        const setting = await settingModel.findOneAndUpdate({}, req.body, { upsert: true });
        res.json({
            error: false,
            message: "Setting Updated Successfully!"
        })
    }
    catch(error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

const getSetting = async (req, res, next) => {
    try {
        const setting = await settingModel.findOne({});
        res.json({
            error: false,
            data: setting
        })
    }
    catch(error) {
        res.json({
            error: true,
            message: error.message
        })
    }
}

module.exports = {
    updateSetting,
    getSetting
}