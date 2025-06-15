const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const clientModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    refer_id: { type: String, required: true, unique: true, index: "text" },
    email: { type: String, unique: true, required: true, toLowerCase: true, index: "text" },
    contact: { type: String, unique: true, required: true },
    isActive: { type: Boolean, required: true },
    description: { type: String },
    Profile: { type: String },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'staff', index: true, required: true },
    isDelete: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("clientModel", clientModel);
