const router = require("express").Router();
const {
  findCity,
  getCityById,
  addCity,
  updateCity,
  deleteCity,
  pagination,
  findCityByState,
  findCityByName
} = require("../Controller/cityCtrl");
const { staffMiddleware } = require("../Middleware/authMiddleware");
const { responseSend } = require("../utils/response");

router.get("/", staffMiddleware, findCity, responseSend);

router.get("/search_name", findCityByName, responseSend);

router.get("/state", findCityByState, responseSend);

router.get("/page", staffMiddleware, pagination, responseSend);

router.get("/:id", staffMiddleware, getCityById, responseSend);

router.post("/addCity", staffMiddleware, addCity, responseSend);

router.put("/updateCity/:id", staffMiddleware, updateCity, responseSend);

router.delete("/deleteCity/:id", staffMiddleware, deleteCity, responseSend);


module.exports = router;
