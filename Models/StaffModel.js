const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const staffModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, toLowerCase: true, index: "text" },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'role' },
    contact: { type: String, unique: true, required: true },
    isActive: { type: Boolean, required: true },
    password: { type: String, required: true },
    Profile: { type: String },
    
  },
  {
    timestamps: true,
  }
);

staffModel.methods.isPasswordMatched = async function (enteredPassword) {
  if (this.password == undefined) {
    return false;
  } else {
    return await bcrypt.compare(enteredPassword, this.password);
  }
};

staffModel.pre("save", async function (next) {
  this.id = String(this._id);
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


module.exports = mongoose.model("StaffModel", staffModel);
