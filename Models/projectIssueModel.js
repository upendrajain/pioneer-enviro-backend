const mongoose = require("mongoose");

const projectIssueSchema = new mongoose.Schema({
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'project', required: true },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'staff', required: true },
    keys: [{ type: String, required: true }],
    description: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("project_issue", projectIssueSchema)