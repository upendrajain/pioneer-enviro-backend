const mongoose = require("mongoose");

const RoleModel = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      enum: ["admin", "staff"], // add more as needed
    },
    permissions: [String], // optional: for RBAC
  },
  {
    timestamps: true,
  });

module.exports = mongoose.model("role", RoleModel);