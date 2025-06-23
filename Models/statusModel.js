const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    name: { type: String },
    displayName: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("status", statusSchema);