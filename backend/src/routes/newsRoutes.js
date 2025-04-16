const express = require("express");
const router = express.Router();
const newsDataController = require("../controllers/newsController");

// Genel haberleri getir
router.get("/:category", newsDataController.getNewsByCategory);

module.exports = router;
