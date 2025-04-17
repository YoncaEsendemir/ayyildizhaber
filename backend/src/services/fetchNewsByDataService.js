const axios = require("axios")
const xml2js = require("xml2js")


const fetchNews = async (category) => {
  try {
    const response = await axios.get(
      `https://www.trthaber.com/xml_mobile.php?tur=xml_genel&kategori=${category}&adet=20&selectEx=yorumSay,okunmaadedi,anasayfamanset,kategorimanset`,
    )
    const parser = new xml2js.Parser()
    const jsonData = await parser.parseStringPromise(response.data)

    // Gelen veriyi kontrol et
    console.log("XML'den dönüştürülen veri yapısı:", JSON.stringify(jsonData, null, 2).substring(0, 500) + "...")

    // XML'den dönüştürülen veri yapısını doğru şekilde işle
    if (jsonData && jsonData.haberler && jsonData.haberler.haber && Array.isArray(jsonData.haberler.haber)) {
      // Haberleri düz bir dizi olarak dönüştür
      return jsonData.haberler.haber.map((item) => {
        // Her bir özelliği diziden çıkar (ilk elemanı al)
        return {
          haber_id: Array.isArray(item.haber_id) ? item.haber_id[0] : "",
          baslik: Array.isArray(item.haber_manset) ? item.haber_manset[0] : "",
          ozet: Array.isArray(item.haber_aciklama) ? item.haber_aciklama[0] : "",
          haber_metni: Array.isArray(item.haber_metni) ? item.haber_metni[0] : "",
          haber_tarihi: Array.isArray(item.haber_tarihi) ? item.haber_tarihi[0] : "",
          haber_link: Array.isArray(item.haber_link) ? item.haber_link[0] : "",
          resim_link: Array.isArray(item.haber_resim)
            ? item.haber_resim[0]
            : Array.isArray(item.manset_resim)
              ? item.manset_resim[0]
              : "",
          kategori: Array.isArray(item.haber_kategorisi) ? item.haber_kategorisi[0] : "",
        }
      })
    }

    // Eğer beklenen yapı yoksa, orijinal veriyi döndür
    console.error("Beklenen veri yapısı bulunamadı, orijinal veriyi döndürüyorum")
    return jsonData.haberler?.haber || []
  } catch (error) {
    console.error(`Haberleri alirken hata oluştu: ${error.message}`)
    throw error
  }
}

module.exports = { fetchNews }

