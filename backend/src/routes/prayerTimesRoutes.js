const express = require("express");
const router = express.Router();
const prayerTimesController = require("../controllers/prayerTimesController");

// Tüm şehirler için namaz vakitleri
router.get("/all", prayerTimesController.getAllPrayerTimes);

// Belirli bir şehir için namaz vakti
router.get("/:city", prayerTimesController.getPrayerTimeByCity);

// Türkiye bölgelerini listele
router.get("/regions/turkey", prayerTimesController.getTurkeyRegions);

module.exports = router;