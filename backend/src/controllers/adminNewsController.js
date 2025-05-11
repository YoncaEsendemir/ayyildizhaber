const newsService = require("../services/fetchAdminNewsService")

// Kategori ekleme kontrolcüsü
const addCategory = async (req, res) => {
  try {
    const result = await newsService.addCategory(req.body)
    res.status(201).json(result)
  } catch (error) {
    console.error("Controller: Kategori ekleme hatası:", error.message)
    res.status(400).json({ error: error.message })
  }
}

// Kategori silme kontrolcüsü
const deleteCategory = async (req, res) => {
  try {
    const result = await newsService.deleteCategory(req.params.id)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Kategori bulunamadı" })
    }
    res.status(200).json({ message: "Kategori başarıyla silindi" })
  } catch (error) {
    console.error("Controller: Kategori silme hatası:", error.message)
    res.status(500).json({ error: error.message })
  }
}

// Tüm kategorileri getirme kontrolcüsü
const getAllCategory = async (req, res) => {
  try {
    const categories = await newsService.getAllCategory()
    res.status(200).json(categories)
  } catch (error) {
    console.error("Controller: Kategori listeleme hatası:", error.message)
    res.status(500).json({ error: error.message })
  }
}

// Kategori güncelleme kontrolcüsü
const updateCategory = async (req, res) => {
  try {
    const result = await newsService.updateCategory(req.body, req.params.id)
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "Kategori bulunamadı" })
    }
    res.status(200).json({ message: "Kategori başarıyla güncellendi" })
  } catch (error) {
    console.error("Controller: Kategori güncelleme hatası:", error.message)
    res.status(500).json({ error: error.message })
  }
}

// Haber ekleme kontrolcüsü - Düzeltilmiş
const addNews = async (req, res) => {
  try {
    console.log("Gelen form verileri:", req.body);
    console.log("Yüklenen dosyalar:", req.files);

    const { title, abstract, contents, categoryId, broadcasting_date, state } = req.body;

    // Kategori ID işlemleri (aynı)
    let categoryIds = [];
    if (categoryId) {
      if (Array.isArray(categoryId)) {
        categoryIds = categoryId.map(id => parseInt(id)).filter(id => !isNaN(id));
      } else if (typeof categoryId === "string") {
        categoryIds = categoryId.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }
    }

    const uploadPath = req.uploadPath || 'uploads'; // middleware'de ayarlandı

    // Dosya yolları
    const foto_list = req.files?.images?.map(file => `/${uploadPath}/${file.filename}`) || [];
    const video_list = req.files?.videos?.map(file => `/${uploadPath}/${file.filename}`) || [];

    const newsData = {
      title,
      abstract,
      contents,
      categoryId: categoryIds,
      broadcasting_date: broadcasting_date || new Date().toISOString().split("T")[0],
      state: state || "aktif",
      foto_list,
      video_list,
    };

    console.log("Servise gönderilen veri:", newsData);

    const result = await newsService.addNewsService(newsData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Controller: Haber ekleme hatası:", error.message);

    if (error.message === "Bu haber başlık zaten var") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Haber eklenirken bir hata oluştu: " + error.message });
  }
};



const deleteNews = async(req,res)=>{
  try{
     const result = await newsService.deleteNewsService(req.params.id)
     if(result.affectedRows=== 0){
       return res.status(404).json({error:'Haber bulunamadı'})
     }

     res.status(200).json({
      message: result.message,
      status: result.status,
      data: result.data
    });
  
  }
  catch(error){
    console.error('Controller:Haber Silmek isterken hata oluştu',error.message)
res.status(500).json({message:'Haber Sile hatasi:', error})
  }
}

const getAllNews= async (req,res)=>{
  try{
    const result= await newsService.selectNewsService()
    res.status(200).json({data:result.data,status:result.status,message:result.message})
  }
  catch(error){
    console.error('Controller: Haber listeleme hatasi:',error)
    res.status(500).json({message:'Haber listelemede hata var', error:error.message})
  }
}

const getNewsById = async (req,res)=>
{
  try{
  const result = await newsService.selectNewsByIdService(req.params.id);
  res.status(200).json({data:result.data,status:result.status,message:result.message})
  }
  catch(error){
    console.error('Controller: Haber listeleme hatasi:',error)
    res.status(500).json({message:'Haber listelemede hata var', error:error.message})
  }
}

const getNewsByCategoryAd= async(req,res)=>{
try{
  const result = await newsService.selectNewsByCategoryService(req.params.kategoriAd);
  res.status(200).json({data:result.data,status:result.status,message:result.message});
}
catch(error){
  console.error('Controller: Haber listeleme hatasi:',error);
  res.status(500).json({message:'Haber listelemede hata var', error:error.message});
}
}

const getLastFiveNews = async(req,res)=>{
  try{
 const result = await newsService.selectLatestFiveNews();
 res.status(200).json({data:result.data, status:result.status,message:result.message});
  }
  catch(error){
    console.error('Controller: Hata var son 5 veri listelenemedi', error);
    res.status(500).json({message:'Son 5 haber listelenemedi', error:error.message});
  }
}

const getTotalNews = async(req,res)=>{
  try{
  const result = await newsService.selectTotalNewsCout();
  res.status(200).json({data:result.data, status:result.status, message:result.message});
  }
  catch(error){
    console.error('Controller: Hata var tüm haber sayisi çekilemedi');
    res.status(500).json({message:'haber sayisini çekerken hata oluştu' , error:error.message});
  }
}

const getTotalCategory = async(req,res)=>{
  try{
   const result = await newsService.selectTotalNewsCategory();
   res.status(200).json({data:result.data,message:result.message, status:result.status,  })
  }
  catch(error){
    console.error('Controller: Hata var tüm haber kategori sayisi çekilemedi');
    res.status(500).json({message:'haber kategori sayisini çekerken hata oluştu' , error:error.message});
  }
}

const editNews = async (req, res) => {
  try {
    console.log("Gelen form verileri:", req.body);
    console.log("Yüklenen dosyalar:", req.files);
    const { title, abstract, contents, categoryId, broadcasting_date, state } = req.body;
    const newsId = req.params.id; // Haber ID'sini route parametrelerinden al

    if (!newsId) {
      return res.status(400).json({ error: "Haber ID'si belirtilmelidir." });
    }

    let categoryIds = [];
    if (categoryId) {
      if (Array.isArray(categoryId)) {
        categoryIds = categoryId.map(id => parseInt(id)).filter(id => !isNaN(id));
      } else if (typeof categoryId === "string") {
        categoryIds = categoryId.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }
    }

    const uploadPath = req.uploadPath || 'uploads'; // middleware'de ayarlandı */

    // Dosya yolları
    const foto_list = req.files?.images?.map(file => `/${uploadPath}/${file.filename}`) || [];
    const video_list = req.files?.videos?.map(file => `/${uploadPath}/${file.filename}`) || [];

    const newsData = {
      title,
      abstract,
      contents,
      categoryId: categoryIds,
      broadcasting_date: broadcasting_date || new Date().toISOString().split("T")[0],
      state: state || "aktif",
      foto_list,
      video_list,
    };

    console.log("Servise gönderilen veri:", { ...newsData, newsId }); // ID'yi de logla

    const result = await newsService.editNewsByIdService(newsData, newsId); // ID'yi servise ilet
    res.status(200).json(result); // Başarılı güncelleme için 200 OK daha uygun olabilir
  } catch (error) {
    console.error("Controller: Haber düzenleme hatası:", error.message);

    if (error.message === "Bu haber başlık zaten var") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Haber düzenlenirken bir hata oluştu: " + error.message });
  }
};

module.exports = {
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
}
