const db = require("../config/db")
const fs = require('fs');
const path = require('path');

// kategori ekle işlemi
const addCategory = async (newsCategoryData) => {
  const { categoryName, description } = newsCategoryData

  const isAvailable = "SELECT * FROM kategori_table WHERE kategori_ad = ?"
  const query = "INSERT INTO kategori_table (kategori_ad, aciklama) VALUES (?, ?)"

  try {
    const [existKategori] = await db.query(isAvailable, [categoryName])

    if (existKategori.length > 0) {
      throw new Error("BU haber Kategorisi zaten var")
    }

    const [result] = await db.query(query, [categoryName, description])

    return { message: `Haber Kategori Eklendi`, status: "successful" }
  } catch (err) {
    console.error("Veritabanı hatasi (Service)", err)
    throw new Error("Haber Kategori veritabanına eklenirken bir hata oluştu")
  }
}

// Kategori Silme id ile
const deleteCategory = async (categoryId) => {
  const query = "DELETE FROM kategori_table WHERE id=?"
  try {
    const [result] = await db.query(query, [categoryId])
    return result // result döndürülüyor ki affectedRows kontrol edilebilsin
  } catch (err) {
    console.error("Veritabanı hatası (Service - Silme):", err)
    throw new Error("Haber Kategori veritabanına silerken bir hata oluştu")
  }
}

// Tüm Kategorileri Listeleme
const getAllCategory = async () => {
  const query = "SELECT * FROM kategori_table"

  try {
    const [result] = await db.query(query)
    return result
  } catch (err) {
    console.error("Veritabani hatasi (Service - Listeleme)", err)
    throw new Error("Haber kategorileri listelerken bir hata oluştu")
  }
}

//Haber Kategori Düzenleme
const updateCategory = async (newsCategoryData, categoryId) => {
  const { categoryName, description } = newsCategoryData

  const query = "UPDATE kategori_table SET kategori_ad = ?, aciklama = ? WHERE id = ?"

  try {
    const result = await db.query(query, [categoryName, description, categoryId])
    return result
  } catch (err) {
    console.error("Veritabani hatasi (Service - Düzenleme)", err)
    throw new Error("Haber kategorileri Düzenleme bir hata oluştu")
  }
}

//Haber ekle - Düzeltilmiş
const addNewsService = async (newsData) => {
  const { title,abstract ,contents, categoryId, broadcasting_date, state, foto_list, video_list } = newsData
  // Başlık kontrolü
  const isAvailable = "SELECT * FROM haberler_table WHERE baslik = ?"
  // Ana haber ekleme sorgusu
  const insertQuery = `
        INSERT INTO haberler_table
        (baslik, ozet, haber_metni, haber_tarih, durum, olusturma_tarihi, guncelleme_tarihi)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `
  // Transaction başlat
  //const connection = await db.getConnection()

  try {
  //  await connection.beginTransaction()

    // Başlık kontrolü
    const [existNews] = await db.query(isAvailable, [title])
    if (existNews.length > 0) {
      throw new Error("Bu haber başlık zaten var")
    }

    // Ana haberi ekle
    const [result] = await db.query(insertQuery, [
      title,
      abstract,
      contents,
      broadcasting_date || new Date(),
      state || "taslak",
    ])

    // Düzeltme: result.id yerine result.insertId kullanılmalı
    const haber_id = result.insertId
    console.log(`Haber ID: ${haber_id} oluşturuldu`)

// categoryId her zaman dizi olarak işlenecek
const categoryArray = Array.isArray(categoryId) ? categoryId : [categoryId]

// Kategorileri ekle
if (categoryArray.length > 0) {
  for (const kat_id of categoryArray) {
    const validKatId = Number.parseInt(kat_id, 10)
    if (!isNaN(validKatId)) {
      await db.query("INSERT INTO haber_kategorileri (haber_id, kategori_id) VALUES (?, ?)", [
        haber_id,
        validKatId,
      ])
      console.log(`Kategori ID: ${validKatId} eklendi`)
    } else {
      console.warn(`Geçersiz kategori ID: ${kat_id}, atlanıyor`)
    }
  }
}
    // Fotoğrafları ekle
    if (Array.isArray(foto_list) && foto_list.length > 0) {
      for (const foto of foto_list) {
        await db.query("INSERT INTO haber_fotograflari (haber_id, resim_link) VALUES (?, ?)", [haber_id, foto])
        console.log(`Fotoğraf: ${foto} eklendi`)
      }
    }
    // Videoları ekle
    if (Array.isArray(video_list) && video_list.length > 0) {
      for (const video of video_list) {
        await db.query("INSERT INTO haber_videolari (haber_id, video_link) VALUES (?, ?)", [haber_id, video])
        console.log(`Video: ${video} eklendi`)
      }
    }
    // Transaction'ı tamamla
   // await connection.commit()
    return {
      message: "Haber başarıyla eklendi",
      status: "successful",
      data: {
        haber_id,
        title,
        foto_count: foto_list ? foto_list.length : 0,
        video_count: video_list ? video_list.length : 0,
        category_count: categoryId ? categoryId.length : 0,
      },
    } 
  } catch (err) {
    // Hata durumunda transaction'ı geri al
  //  await connection.rollback()
    console.error("Veritabanı hatası:", err)
    throw err // Hatayı olduğu gibi ilet
  } 
}

const editNewsByIdService = async (editData, newsId) => {
  const {
    title,
    abstract,
    contents,
    categoryId,
    broadcasting_date,
    state,
    foto_list,
    video_list
  } = editData;

  const editQueryNews = `
    UPDATE haberler_table
    SET baslik = ?,
        ozet = ?,
        haber_metni = ?,
        haber_tarih = ?,
        durum = ?,
        guncelleme_tarihi = NOW()
    WHERE haber_id = ?
  `;

  const deleteQueryKategori = `DELETE FROM haber_kategorileri WHERE haber_id = ?`;
  const insertQueryKategori = `INSERT INTO haber_kategorileri (haber_id, kategori_id) VALUES (?, ?)`;

  const deleteQueryFoto = `DELETE FROM haber_fotograflari WHERE haber_id = ?`;
  const insertQueryFoto = `INSERT INTO haber_fotograflari (haber_id, resim_link) VALUES (?, ?)`;

  const deleteQueryVideo = `DELETE FROM haber_videolari WHERE haber_id = ?`;
  const insertQueryVideo = `INSERT INTO haber_videolari (haber_id, video_link) VALUES (?, ?)`;

  // 🔍 Veritabanındaki eski dosyaları al
  const selectOldFotos = `SELECT resim_link FROM haber_fotograflari WHERE haber_id = ?`;
  const selectOldVideos = `SELECT video_link FROM haber_videolari WHERE haber_id = ?`;

  try {
    // 🔍 Eski fotoğraf ve videoları veritabanından al
    const [oldFotos] = await db.query(selectOldFotos, [newsId]);
    const [oldVideos] = await db.query(selectOldVideos, [newsId]);

    // 📂 Fiziksel klasörden eski fotoğrafları sil
    oldFotos.forEach((row) => {
      const filePath = path.join(process.cwd(), 'public', row.resim_link);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Silindi: ${filePath}`);
      } else {
        console.warn(`Dosya bulunamadı: ${filePath}`);
      }
    });

    // 📂 Fiziksel klasörden eski videoları sil
    oldVideos.forEach((row) => {
      const filePath = path.join(process.cwd(), 'public', row.video_link);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Silindi: ${filePath}`);
      } else {
        console.warn(`Dosya bulunamadı: ${filePath}`);
      }
    });

    // 🔄 Haber güncelle
    await db.query(editQueryNews, [
      title,
      abstract,
      contents,
      broadcasting_date || new Date(),
      state || "taslak",
      newsId,
    ]);
    console.log(`Haber ID: ${newsId} güncellendi`);

    // 🔄 Kategorileri güncelle
    const categoryArray = Array.isArray(categoryId) ? categoryId : [categoryId];
    if (categoryArray && categoryArray.length > 0) {
      await db.query(deleteQueryKategori, [newsId]);
      for (const kat_id of categoryArray) {
        const validKatId = parseInt(kat_id);
        if (!isNaN(validKatId)) {
          await db.query(insertQueryKategori, [newsId, validKatId]);
        }
      }
    }

    // 🔄 Fotoğrafları veritabanında güncelle
    await db.query(deleteQueryFoto, [newsId]);
    if (Array.isArray(foto_list)) {
      for (const foto of foto_list) {
        await db.query(insertQueryFoto, [newsId, foto]);
      }
    }

    // 🔄 Videoları veritabanında güncelle
    await db.query(deleteQueryVideo, [newsId]);
    if (Array.isArray(video_list)) {
      for (const video of video_list) {
        await db.query(insertQueryVideo, [newsId, video]);
      }
    }

    return {
      message: "Haber başarıyla güncellendi",
      status: "successful",
      data: {
        haber_id: newsId,
        foto_count: foto_list ? foto_list.length : 0,
        video_count: video_list ? video_list.length : 0,
        category_count: categoryArray.length
      },
    };

  } catch (err) {
    console.error("Hata (editNewsByIdService):", err);
    throw new Error("Haber düzenlenirken hata oluştu");
  }
};


// veritabanında haber silme Metodu
const deleteNewsService = async (newsId) => {
  // Transaction başlat
 // const connection = await db.getConnection()
  try {
 //   await connection.beginTransaction()

    // Önce ilişkili tabloları temizle
    await db.query("DELETE FROM haber_fotograflari WHERE haber_id = ?", [newsId])
    await db.query("DELETE FROM haber_videolari WHERE haber_id = ?", [newsId])
    await db.query("DELETE FROM haber_kategorileri WHERE haber_id = ?", [newsId])

    // Sonra ana haberi sil
    const [result] = await db.query("DELETE FROM haberler_table WHERE haber_id = ?", [newsId])

    if (result.affectedRows === 0) {
      throw new Error("Bu haber bulunamadı")
    }

    //await connection.commit()

    return {
      message: "Haber başarıyla silindi",
      status: "successful",
      data:result,
    }
  } catch (err) {
   // await connection.rollback()
    console.error("Veritabanı hatası (SERVICE - SILME):", err)
    throw err
  }
}

// tüm haberleri getir
const selectNewsService = async () => {
  try {
    // Ana haber bilgilerini al
    const [haberler] = await db.query(`
            SELECT h.*, 
                   GROUP_CONCAT(DISTINCT k.kategori_ad) as kategoriler
            FROM haberler_table h
            LEFT JOIN haber_kategorileri hk ON h.haber_id = hk.haber_id
            LEFT JOIN kategori_table k ON hk.kategori_id = k.id
            GROUP BY h.haber_id
            ORDER BY h.olusturma_tarihi DESC
        `)

    // Her haber için fotoğraf ve video bilgilerini al
    for (const haber of haberler) {
      const [fotograflar] = await db.query("SELECT resim_link FROM haber_fotograflari WHERE haber_id = ?", [haber.haber_id])

      const [videolar] = await db.query("SELECT video_link FROM haber_videolari WHERE haber_id = ?", [haber.haber_id])
      
    //  console.log(fotograflar);
     // console.log(videolar);

      haber.resim_link = fotograflar.map((f) => f.resim_link)
      haber.video_link = videolar.map((v) => v.video_link)
    }

    return {
      message: "Haberler başarıyla getirildi",
      status: "successful",
      data: haberler,
    }
  } catch (err) {
    console.error("Veritabanı hatası (SERVICE - TÜM HABERLERİ GETİRME)", err)
    throw new Error("Veritabanından haberleri getirirken hata oluştu")
  }
}

// haber saysını getiriyor
const selectTotalNewsCout = async ()=>{
  try{
    const [result] = await db.query(`SELECT COUNT(*) AS toplam_haber_sayisi FROM haberler_table`);

   return{
    message:"Toplam haber sayısı başarıyla getirildi",
    status:"successful",
    data :result[0].toplam_haber_sayisi,
   }
  }
  catch(err){
    console.error("Veritabanı hatası (SERVICE - TOPLAM HABER SAYSIS)",err);
    throw new Error("Veritabanından toplam haber sayısını getirirken hata oluştu");
  }
};

const selectTotalNewsCategory = async ()=>{
try{
  const [result] = await db.query(`SELECT COUNT(*) AS toplam_category_sayisi FROM kategori_table`);
  return{
    message:'Toplam Kategori sayısı başarıyla getirildi',
    status:"successful",
    data:result[0].toplam_category_sayisi,
  }
}
catch(err){
  console.error("Veritabanı hatası (SERVICE - TOPLAM HABER SAYSIS)",err);
  throw new Error("Veritabanından toplam haber sayısını getirirken hata oluştu");
}
}

// son 5 haber getiriyor ama tek haberler_tablosu
const selectLatestFiveNews = async ()=>{
  const sqlFiveQuery = `
    SELECT h.*,
           GROUP_CONCAT(DISTINCT k.kategori_ad) AS kategoriler
    FROM haberler_table h
    LEFT JOIN haber_kategorileri hk ON h.haber_id = hk.haber_id
    LEFT JOIN kategori_table k ON hk.kategori_id = k.id
    GROUP BY h.haber_id
    ORDER BY h.olusturma_tarihi DESC
    LIMIT 5
  `;
  try{
const [haberler] = await db.query(sqlFiveQuery)
     return{
      message:"Son 5 haber başarıyla getirildi",
      status :"successful",
      data: haberler
     }
  }
  catch(err){
    console.error("Veritabanı hatası (SERVICE - SON 5 HABER GETİRME)", err);
    throw new Error("Veritabanından son 5 haberi getirirken hata oluştu");
  }
}

// id göre haber getir
const selectNewsByIdService = async (haberId) => {
  const selectById = `
    SELECT h.*,
           GROUP_CONCAT(DISTINCT k.kategori_ad) as kategoriler
    FROM haberler_table h
    LEFT JOIN haber_kategorileri hk ON h.haber_id = hk.haber_id
    LEFT JOIN kategori_table k ON hk.kategori_id = k.id
    WHERE h.haber_id = ?
    GROUP BY h.haber_id
  `;

  const selectByIdVideos = 'SELECT video_link FROM haber_videolari WHERE haber_id=?';
  const selectByIdfoto = 'SELECT resim_link FROM haber_fotograflari WHERE haber_id=?';

  // Haber bilgilerini ve  kategorilerini al
  try {
    const [haber] = await db.query(selectById, [haberId]);

    //Eğer hata bulunamazsa hata döndur
    if (!haber || haber.length === 0) {
      return {
        message: "Belirtilen ID'ye sahip haber bulunamadı",
        status: "faild",
        data: null,
      };
    }

    const tekHaber = haber[0];

    //habere ait fotoğraf bilgilerini al
    const [fotograflar] = await db.query(selectByIdfoto, [haberId]);

    tekHaber.resim_link = fotograflar.map((f) => f.resim_link); 

    // habere ait video bilgilerinial
    const [videolar] = await db.query(selectByIdVideos, [haberId]);

    tekHaber.video_link = videolar.map((v) => v.video_link);

    return {
      message: "Haber başarıyla getirildi",
      status: "successful",
      data: tekHaber,
    };
  } catch (error) {
    console.error("Veritabanı hatası (SERVICE - ID'YE GÖRE HABER GETİRME)", error);
    throw new Error("Veritabanından haber getirilirken hata oluştu");
  }
};

// kategorilere göre haber getir 
const selectNewsByCategoryService= async(kategoriAd)=>{
  const selectByCategoryAd= "SELECT id FROM kategori_table WHERE kategori_ad=?";

  const getAllCategorynews=`   SELECT h.*,
  GROUP_CONCAT(DISTINCT k.kategori_ad) as kategoriler
FROM haberler_table h
LEFT JOIN haber_kategorileri hk ON h.haber_id = hk.haber_id
LEFT JOIN kategori_table k ON hk.kategori_id = k.id
WHERE hk.kategori_id = ?
GROUP BY h.haber_id
ORDER BY h.olusturma_tarihi DESC`

const getAllCategorynewsFoto=`SELECT resim_link FROM haber_fotograflari WHERE haber_id = ?`;
const getAllCategorynewsVideo = `SELECT video_link FROM haber_videolari WHERE haber_id = ?`   
 
 try{
   //Belirtilen kategori adına sahip kategori ID'sini al 
   const [kategori]= await db.query(selectByCategoryAd,[kategoriAd]);
  
   if(!kategori || kategori.length===0){
       return{
        message:`${kategoriAd} kategorisi bulunamadı`,
        status:'false',
        data:null
       }
   }

   const kategoriId= kategori[0].id
   
   //belirtilen kaktegori ait haberlerin ana bilgilerini ve kategorilerini al 
   const [haberleri] = await db.query(getAllCategorynews,[kategoriId]);

// Her haber için fotoğraf ve video bilgilerini al
   for(const haber of haberleri){
    const [fotograflar] =await db.query(getAllCategorynewsFoto, [haber.haber_id]);
    haber.resim_link = fotograflar.map((f) => f.resim_link);

    const [videolar]= await db.query(getAllCategorynewsVideo, [haber.haber_id]);
    haber.video_link = videolar.map((v) => v.video_link);
   }

   return {
    message: `"${kategoriAd}" kategorisine ait haberler başarıyla getirildi`,
    status: "successful",
    data: haberleri,
  };
 }
 catch(error){
  console.error(
    "Veritabanı hatası (SERVICE - KATEGORİYE GÖRE HABER GETİRME)", error);
  throw new Error("Veritabanından kategoriye göre haberler getirilirken hata oluştu");
};
 }


module.exports = {
  addCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
  addNewsService,
  deleteNewsService,
  selectNewsService,
  selectNewsByIdService,
  selectNewsByCategoryService,
  editNewsByIdService,
  selectTotalNewsCout,
  selectLatestFiveNews,
  selectTotalNewsCategory
}
