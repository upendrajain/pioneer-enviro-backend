const router = require("express").Router()
const {findCountry, getCountryById, addCountry, updateCountry, deleteCountry, pagination, countryPublic } = require("../Controller/countryCtrl");
const {staffMiddleware} = require("../Middleware/authMiddleware");
const {responseSend} = require("../utils/response");

router.get('/', staffMiddleware, findCountry);

router.get('/public/list', countryPublic, responseSend);

router.get('/:id', staffMiddleware, getCountryById)


router.post('/addcountry', staffMiddleware, addCountry)

router.put('/updatecountry/:id', staffMiddleware, updateCountry)

router.delete('/deletecountry/:id', staffMiddleware, deleteCountry)

router.get('/page/:page&:count', staffMiddleware, pagination)

module.exports = router