const router = require("express").Router()
const {findState, getStateById, addState, updateState, deleteState, stateListByCountry, stateDataEntry} = require("../Controller/stateCtrl")
const {staffMiddleware} = require("../Middleware/authMiddleware")

const multer = require("multer");

const path = require("path");
const {responseSend} = require("../utils/response")

var storage1 = multer.diskStorage({
    destination: (req, file, callBack) => {
      ///    var error = new Error("Invalid mime type");
      callBack(null, "./uploads/");
    },
    filename: (req, file, callBack) => {
      callBack(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  var upload1 = multer({
    storage: storage1,
  });
  
  


  router.get("/country/:id", stateListByCountry, responseSend)
router.get('/', staffMiddleware, findState)
router.get('/mb/public', findState);

router.get('/:id', staffMiddleware, getStateById)

router.post("/stateDataEntry", upload1.single("file"), stateDataEntry);
router.post('/addState', staffMiddleware, addState)

router.put('/updateState/:id', staffMiddleware, updateState)

router.delete('/deleteState/:id', staffMiddleware, deleteState)

module.exports = router
