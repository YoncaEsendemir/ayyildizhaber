const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/fetchWeatherDataController");

//Tüm şehirlerin hava durumunun getir

router.get("/all", weatherController.getAllWeather);

// Belirli bir şehrin hava durumunu getir
router.get("/:city", weatherController.getWeatherByCity);

module.exports = router;