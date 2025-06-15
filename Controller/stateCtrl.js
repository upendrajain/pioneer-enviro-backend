const StateModel = require("../Models/stateModel");
const path = require("path");
const fs = require("fs");
__dirname = path.resolve(path.dirname(__filename), "../../");
const mongoose = require("mongoose")

const findState = async (req, res, next) => {
  try {
    const client = await Client.get("State");
    if(client == null) {
      const State = await StateModel.find();
      await Client.set("State", JSON.stringify(State));
      await Client.expire("State", 36000);
      res.data = State;  
    }
    else {
      res.data = JSON.parse(client);
    }
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const getStateById = async (req, res, next) => {
  try {
    const State = await StateModel.findById(req.params.id);
    res.data = State;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const addState = async (req, res, next) => {
  try {
    const State = await StateModel.create(req.body);
    res.data = State;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const updateState = async (req, res, next) => {
  try {
    const State = await StateModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    let allKeys = await Client.keys("State");
    if (allKeys.length != 0) {
      const del = await Client.del(allKeys);
    }
    res.data = State;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const deleteState = async (req, res, next) => {
  try {
    const State = await StateModel.findByIdAndDelete(req.params.id);
    let allKeys = await Client.keys("State");
    if (allKeys.length != 0) {
      const del = await Client.del(allKeys);
    }
    res.data = State;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const stateListByCountry = async (req, res, next) => {
  try {
    const countryId = req.params.id; // leave it as string
    console.log("Matching country_id:", countryId);

    const states = await StateModel.find({ country_id: new mongoose.Types.ObjectId(countryId) });
    res.data = states;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};






//this for bulk import data entry via json
const stateDataEntry = async (req, res, next) => {
  try {
    let data = await fs.promises.readFile(
      __dirname + "/uploads/" + req.file.filename,
      "utf8"
    );

    data = JSON.parse(data);
    data.forEach((data) => {
      data._id = data._id["$oid"];
      data.createdAt = data["$createdAt"];
      data.updatedAt = data["$updatedAt"];
    })

    let allKeys = await Client.keys("State");
    if (allKeys.length != 0) {
      const del = await Client.del(allKeys);
    }
    await StateModel.insertMany(data);
    await fs.unlink(__dirname + "/uploads/" + req.file.filename)

    res.json({ message: "Success" });
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

module.exports = {
  findState,
  getStateById,
  addState,
  updateState,
  deleteState,
  stateListByCountry,
  stateDataEntry,
};
