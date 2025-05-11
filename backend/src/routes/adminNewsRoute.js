const express = require("express");
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
  getTotalCategory
} = require("../controllers/adminNewsController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Kategori işlemleri
router.post("/kategoriEkle", express.json(), addCategory);
router.delete("/kategoriSil/:id", deleteCategory);
router.get("/kategoriListelendi", getAllCategory);
router.put("/kategoriDuzenlendi/:id", express.json(), updateCategory);

// Haber işlemleri (form-data ile medya içeren haber ekleme)
router.post(
  "/haberEkle",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  addNews
);
router.delete("/haberSilme/:id", deleteNews);
router.get("/haberler", getAllNews);
router.get("/haberId/:id",getNewsById);
router.get("/haberlerKategori/:kategoriAd",getNewsByCategoryAd);
router.get("/sonBeshaberler",getLastFiveNews);
router.get("/totalHaber",getTotalNews);
router.get("/haberkategoriTotal",getTotalCategory);
router.put("/haberDuzenle/:id",  upload.fields([
  { name: "images", maxCount: 2 },
  { name: "videos", maxCount: 1 },
]),
editNews
);


module.exports = router;
