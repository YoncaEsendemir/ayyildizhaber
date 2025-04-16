const newsController = require("../controllers/fetchNewsController");
const express = require("express");
const router = express.Router();

router.get("/:category", newsController.getNews);

module.exports = router;