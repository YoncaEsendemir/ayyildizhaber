export const sortNewsData = (data) => {
    return [...data].sort((a, b) => {
      // Haberlerin TRT kaynağına ait olup olmadığını kontrol et
      const isASourceTrt = a.source === "trt" || a.kaynak === "trt"
      const isBSourceTrt = b.source === "trt" || b.kaynak === "trt"
  
      // Kendi haberlerimizi (TRT olmayanları) TRT haberlerinden önce sırala
      if (!isASourceTrt && isBSourceTrt) {
        return -1 // a (kendi haberimiz) b'den (TRT haberi) önce gelir
      }
      if (isASourceTrt && !isBSourceTrt) {
        return 1 // b (kendi haberimiz) a'dan (TRT haberi) önce gelir
      }
  
      // Eğer her iki haber de aynı kaynaktan geliyorsa (ikisi de kendi veya ikisi de TRT),
      // haber_id'ye göre azalan sırada sırala
      const idA = Number.parseInt(a.haber_id, 10) || 0
      const idB = Number.parseInt(b.haber_id, 10) || 0
      return idB - idA // Azalan sırada (en yeni önce) sırala
    })
  }
  