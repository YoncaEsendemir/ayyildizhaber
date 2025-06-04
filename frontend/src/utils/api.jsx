import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

// Header'ı döndüren yardımcı fonksiyon
export const getAuthHeader = () => {
  const token = localStorage.getItem("authToken")
  if (!token) {
    throw new Error("Giriş token'ı bulunamadı. Lütfen tekrar giriş yapın.")
  }
  return {
    Authorization: `Bearer ${token}`,
  }
}

export const fetchWeatherData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/all`)
    return response.data
  } catch (error) {
    console.error("Error fetching all weather data:", error)
    throw error
  }
}

export const fetchWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/${encodeURIComponent(city)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error)
    throw error
  }
}

export const fetchAllPrayerTimes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayer-times/all`)
    return response.data
  } catch (error) {
    console.error("Error fetching all prayer times:", error)
    throw error
  }
}

export const fetchPrayerTimesByCity = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayer-times/${encodeURIComponent(city)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching prayer times for ${city}:`, error)
    throw error
  }
}

export const fetchTurkeyRegions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prayer-times/regions/turkey`)
    return response.data
  } catch (error) {
    console.error("Error fetching Turkey regions:", error)
    throw error
  }
}

export const fetchNews = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news/${encodeURIComponent(category)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching news ${category}`, error)
    throw error
  }
}

export const fetchNews2 = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news2/${encodeURIComponent(category)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching news ${category}`, error)
    throw error
  }
}
// DÖVİZ API'LERİ - Basit cache sistemi ile
export const fetchCurrencyGold = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/gold`)
    return response.data
  } catch (error) {
    console.error("Error fetching gold currency data:", error)
    throw error
  }
}

export const fetchCurrencyCrypto = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/crypto`)
    return response.data
  } catch (error) {
    console.error("Error fetching crypto currency data:", error)
    throw error
  }
}

export const fetchCurrencyMoney = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/money`)
    return response.data
  } catch (error) {
    console.error("Error fetching money currency data:", error)
    throw error
  }
}

export const fetchCurrencyHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/currency/history`)
    return response.data
  } catch (error) {
    console.error("Error fetching currency history data:", error)
    throw error
  }
}
/*
// getManuelHaber fonksiyonunu src klasöründeki dosya yoluna göre düzeltiyorum
export const getManuelHaber = async () => {
  try {
    // Dosya yolunu src/ManuelHaber/ayyildizhaber.json olarak düzeltiyorum
    const response = await axios.get("/src/ManuelHaber/ayyildizhaber.json")

    // Gelen veriyi kontrol etmek için log ekliyorum
    console.log("Manuel haber verisi:", response.data)

    // Veri yapısını TRT haberleri ile uyumlu hale getiriyorum
    if (Array.isArray(response.data)) {
      return response.data.map((haber) => ({
        ...haber,
        // Eksik alanları varsa dolduruyorum
        haber_metni: haber.haber_metni || "",
        haber_link: haber.haber_link || "",
        kategori: haber.kategori || "Genel",
      }))
    }

    return response.data
  } catch (error) {
    console.error(`Manuel haber alırken hata oluştu:`, error)
    console.error(`Hata detayı:`, error.response || error.message)

    // Alternatif yol deniyorum
    try {
      // Alternatif dosya yolu
      const altResponse = await import("../ManuelHaber/ayyildizhaber.json")
      console.log("Alternatif yoldan manuel haber verisi:", altResponse.default)
      return Array.isArray(altResponse.default) ? altResponse.default : [altResponse.default]
    } catch (altError) {
      console.error(`Alternatif yoldan manuel haber alırken hata:`, altError)
      // Hata durumunda boş dizi döndürüyorum ki uygulama çalışmaya devam etsin
      return []
    }
  }
}
*/

export const authAdmin = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        // axios.defaults.wi
        withCredentials: true, //Çerez alabilmek için
      },
    )
    return response.data
  } catch (error) {
    console.error(`Hata yakalandi tekrar dene`, error)
    throw error
  }
}

//register

export const registerAdmin = async (name, email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      {
        name,
        email,
        password,
      },
      {
        // axios.defaults.wi
        withCredentials: true, //Çerez alabilmek için
      },
    )
    return response.data
  } catch (error) {
    console.error("Error registering admin:", error)
    throw error
  }
}

// Dashboard verilerini getiren fonksiyon
export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/dashboard`, {
      headers: getAuthHeader(),
    })
    return response.data
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw error
  }
}

// Haber Kategorileri için api işlemleri

// Yeni kategori ekleme

export const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/adminNews/kategoriEkle`, categoryData)
    return response.data
  } catch (error) {
    console.error("Kategori ekleme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Kategori eklenemedi")
  }
}

// Kategori silme
export const deleteCategory = async (id) => {
  // fetch veya axios ile DELETE isteği atılır
  try {
    const response = await axios.delete(`${API_BASE_URL}/adminNews/kategoriSil/${id}`)
    return response.data
  } catch (error) {
    console.error("Kategori silme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Kategori silinemedi")
  }
}

// Kategorileri listeleme
export const getAllCategories = async () => {
  //  axios ile GET isteği atılır
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/kategoriListelendi`)
    return response.data
  } catch (error) {
    console.error("Kategori listeleme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Kategori Listeleme")
  }
}

// kategori sayisi habere göre
export const getCategoriesCout = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/kategorilerHaberSayisi`)
    return response.data
  } catch (err) {
    console.error("Kategori Sayısı Hatası", err.response?.data?.message || err.message)
    throw new Error(err.response?.data?.message || "Kategori Sayısı Hatası")
  }
}


// Kategori güncelleme
export const updateCategory = async (id, updatedData) => {
  // axios ile PUT isteği atılır
  try {
    const response = await axios.put(`${API_BASE_URL}/adminNews/kategoriDuzenlendi/${id}`, updatedData)
    return response.data
  } catch (error) {
    console.error("Kategori güncelleme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Kategori güncellenemedi")
  }
}

//Haber ekleme
export const addNews = async (newsData) => {
  try {
    const formData = new FormData()
    //Metin verilerini ekle
    formData.append("title", newsData.baslik)
    formData.append("abstract", newsData.ozet.substring(0, 300)) //Özet için içeriğin ilk 300 karakteri
    formData.append("contents", newsData.icerik)
    formData.append("broadcasting_date", newsData.yayinTarihi)
    formData.append("state", newsData.durum)
    //Kategoriler Ekle
    if (newsData.kategoriler && newsData.kategoriler.length > 0) {
      newsData.kategoriler.forEach((kategori) => {
        formData.append("categoryId", kategori.id)
      })
    }
    // Resimleri ekle (hem dosyalar hem de linkler)
    if (newsData.resim && newsData.resim.length > 0) {
      for (let i = 0; i < newsData.resim.length; i++) {
        formData.append("images", newsData.resim[i]) // Dosya yüklemeleri
      }
    }
    if (newsData.resimLink) {
      // Resim linki varsa
      formData.append("imageLinks", newsData.resimLink) // Resim linki
    }

    // Videoları ekle (Artık dosya değil, link)
    if (newsData.video) {
      formData.append("videoLink", newsData.video) // Yeni alan adı: videoLink
    }

    // API isteğini gönder
    const response = await axios.post(`${API_BASE_URL}/adminNews/haberEkle`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error("Haber ekleme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Haber eklenemedi")
  }
}

//Haber Silme
export const deleteNewsById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/adminNews/haberSilme/${id}`)
    return response.data
  } catch (error) {
    console.error("haber Silerken hata oluştu", error.response?.data?.message || error.message)
    Error(error.response?.data?.message || "haberler Silmede")
  }
}

export const getAllNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/haberler`)

    const newsArray = Array.isArray(response.data?.data)
      ? response.data.data
      : response.data?.data
        ? [response.data.data]
        : []

    return newsArray.map((haber) => {
      // Resim linklerini işler
      const resimLinkleri = Array.isArray(haber.resim_link)
        ? haber.resim_link
        : typeof haber.resim_link === "string"
          ? [haber.resim_link]
          : []

      const tamResimLinkleri = resimLinkleri.map((link) => {
        if (link && typeof link === "string") {
          if (link.startsWith("http://") || link.startsWith("https://")) return link
          if (link.startsWith("/uploads/")) return `http://localhost:5000${link}`
          return link
        }
        return "/placeholder.svg?height=200&width=350"
      })

      // Video linklerini işler (Artık yerel dosya değil, doğrudan URL olabilir)
      const videoLinkleri = Array.isArray(haber.video_link)
        ? haber.video_link
        : typeof haber.video_link === "string"
          ? [haber.video_link]
          : []

      const tamVideoLinkleri = videoLinkleri.map((link) => {
        if (link && typeof link === "string") {
          // YouTube veya diğer harici URL'ler için doğrudan linki döndür
          if (link.startsWith("http://") || link.startsWith("https://")) return link
          // Eski yerel yüklemeler için prefix ekle
          if (link.startsWith("/uploads/")) return `http://localhost:5000${link}`
          return link
        }
        return ""
      })

      return {
        ...haber,
        resim_link: tamResimLinkleri.length > 0 ? tamResimLinkleri[0] : "/placeholder.svg?height=200&width=350",
        resim_links: tamResimLinkleri,
        video_link: tamVideoLinkleri.length > 0 ? tamVideoLinkleri[0] : "",
        video_links: tamVideoLinkleri,
        kategori: haber.kategoriler || "Diğer",
      }
    })
  } catch (error) {
    console.error("Haber Listesi getirilemedi hata:", error.response?.data?.message || error.message)
    return []
  }
}

export const getNewsById = async (newsId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/haberId/${newsId}`)

    // Eğer response.data bir obje ise ve data alanı varsa, onu kullan
    // Aksi takdirde response.data'yı doğrudan kullan
    const responseData = response.data?.data ? response.data : response

    // Eğer data bir dizi değilse ve bir obje ise, onu bir diziye dönüştür
    const newsArray = Array.isArray(responseData.data)
      ? responseData.data
      : responseData.data
        ? [responseData.data]
        : []

    return newsArray.map((haber) => {
      // Resim linklerini işler
      const resimLinkleri = Array.isArray(haber.resim_link)
        ? haber.resim_link
        : typeof haber.resim_link === "string"
          ? [haber.resim_link]
          : []

      const tamResimLinkleri = resimLinkleri.map((link) => {
        if (link && typeof link === "string") {
          if (link.startsWith("http://") || link.startsWith("https://")) return link
          if (link.startsWith("/uploads/")) return `http://localhost:5000${link}`
          return link
        }
        return "/placeholder.svg?height=200&width=350"
      })

      // Video linklerini işler (Artık yerel dosya değil, doğrudan URL olabilir)
      const videoLinkleri = Array.isArray(haber.video_link)
        ? haber.video_link
        : typeof haber.video_link === "string"
          ? [haber.video_link]
          : []

      const tamVideoLinkleri = videoLinkleri.map((link) => {
        if (link && typeof link === "string") {
          // YouTube veya diğer harici URL'ler için doğrudan linki döndür
          if (link.startsWith("http://") || link.startsWith("https://")) return link
          // Eski yerel yüklemeler için prefix ekle
          if (link.startsWith("/uploads/")) return `http://localhost:5000${link}`
          return link
        }
        return ""
      })

      return {
        ...haber,
        resim_link: tamResimLinkleri.length > 0 ? tamResimLinkleri[0] : "/placeholder.svg?height=200&width=350",
        resim_links: tamResimLinkleri,
        video_link: tamVideoLinkleri.length > 0 ? tamVideoLinkleri[0] : "",
        video_links: tamVideoLinkleri,
        kategori: haber.kategoriler || "Diğer",
      }
    })
  } catch (error) {
    console.error("Haber getirilemedi hata:", error.response?.data?.message || error.message)
    return []
  }
}

export const getNewsByCategory = async (categoryName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/haberlerKategori/${categoryName}`)
    const newsArray = Array.isArray(response.data?.data)
      ? response.data?.data
      : response.data?.data
        ? [response.data.data]
        : []

    return newsArray.map((haber) => {
      // Resim linklerini işler
      const resimLinkleri = Array.isArray(haber.resim_link)
        ? haber.resim_link
        : typeof haber.resim_link === "string"
          ? [haber.resim_link]
          : []

      const tamResimLinkleri = resimLinkleri.map((link) => {
        if (link && typeof link === "string") {
          if (link.startsWith("http://") || link.startsWith("https://")) return link
          if (link.startsWith("/uploads/")) return `http://localhost:5000${link}`
          return link
        }
        return "/placeholder.svg?height=200&width=350"
      })

      // Video linklerini işler
      const videoLinkleri = Array.isArray(haber.video_link)
        ? haber.video_link
        : typeof haber.video_link === "string"
          ? [haber.video_link]
          : []

      const tamVideoLinkleri = videoLinkleri.map((link) => {
        if (link && typeof link === "string") {
          if (link.startsWith("http://") || link.startsWith("https://")) return link
          if (link.startsWith("/uploads/")) return `http://localhost:5000${link}`
          return link
        }
        return ""
      })

      return {
        ...haber,
        resim_link: tamResimLinkleri.length > 0 ? tamResimLinkleri[0] : "/placeholder.svg?height=200&width=350",
        resim_links: tamResimLinkleri,
        video_link: tamVideoLinkleri.length > 0 ? tamVideoLinkleri[0] : "",
        video_links: tamVideoLinkleri,
        kategori: haber.kategoriler || "Diğer",
      }
    })
  } catch (error) {
    console.error("Haber Listesi getirilemedi hata:,", error.response?.data?.message || error.message)
    return []
  }
}

export const editNews = async (formData, newsId) => {
  try {
    // FormData içeriğini kontrol et
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    // API isteğini gönder
    const response = await axios.put(`${API_BASE_URL}/adminNews/haberDuzenle/${newsId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error("Haber düzenleme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Haber düzenlenemedi")
  }
}

export const getTotalNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/totalHaber`)
    return response.data
  } catch (error) {
    console.error("Haber sayisi listeleme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Haber Sayısı Listeleme hatası")
  }
}

//Toplam kategori seç
export const getTotalCategoryNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/haberkategoriTotal`)
    return response.data
  } catch (error) {
    console.error("Haber kategori sayisi listeleme hatası:", error.response?.data?.message || error.message)
    throw new Error(error.response?.data?.message || "Haber Kategori Sayısı hatası")
  }
}

export const getLastFiveNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/adminNews/sonBeshaberler`)
    return response.data
  } catch (error) {
    console.error("Son 5 Haber çekerken hata oluştu")
    throw new Error(error.response?.data?.message || "Son 5 haber çekerken hata oluştu ")
  }
}
