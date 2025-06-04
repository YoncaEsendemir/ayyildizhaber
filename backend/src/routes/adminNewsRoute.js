const express = require("express")
const {
  addCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
  addNews,
  deleteNews,
  getAllNews,
  getNewsById,
  getNewsByCategoryAd,
  editNews,
  getTotalNews,
  getLastFiveNews,
  getTotalCategory,
  getCategoryNewsCounts
} = require("../controllers/adminNewsController")
const upload = require("../middlewares/uploadMiddleware")

const router = express.Router()

// Kategori işlemleri
router.post("/kategoriEkle", express.json(), addCategory)
router.delete("/kategoriSil/:id", deleteCategory)
router.get("/kategoriListelendi", getAllCategory)
router.put("/kategoriDuzenlendi/:id", express.json(), updateCategory)

// Haber işlemleri (form-data ile medya içeren haber ekleme)
router.post(
  "/haberEkle",
  upload.fields([
    { name: "images", maxCount: 5 }, // Resim dosyaları için multer hala aktif
    // { name: "videos", maxCount: 2 }, // Video yükleme kaldırıldı
  ]),
  addNews,
)
router.delete("/haberSilme/:id", deleteNews)
router.get("/haberler", getAllNews)
router.get("/haberId/:id", getNewsById)
router.get("/haberlerKategori/:kategoriAd", getNewsByCategoryAd)
router.get("/sonBeshaberler", getLastFiveNews)
router.get("/totalHaber", getTotalNews)
router.get("/haberkategoriTotal", getTotalCategory)
router.get("/kategorilerHaberSayisi", getCategoryNewsCounts)
router.put(
  "/haberDuzenle/:id",
  upload.fields([
    { name: "images", maxCount: 2 }, // Resim dosyaları için multer hala aktif
    // { name: "videos", maxCount: 1 }, // Video yükleme kaldırıldı
  ]),
  editNews,
)

module.exports = router
