const express = require("express")
const router = express.Router()
const currencyController = require("../controllers/fetchCurrencyController")

// Altın değerleri için yol
router.get("/gold", currencyController.getGold)

// Crypto için yol
router.get("/crypto", currencyController.getCrypto)

// Döviz para birimi için yol
router.get("/money", currencyController.getMoney)

// Tüm döviz verileri için yol
router.get("/all", currencyController.getAllCurrency)

// Geçmiş döviz verilerini getir
router.get("/history", currencyController.getCurrencyHistory)

module.exports = router
