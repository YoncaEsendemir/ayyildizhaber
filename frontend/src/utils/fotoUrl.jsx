// Resim URL'sini tam formata çeviren yardımcı fonksiyon
export const getFullImageUrl = (url) => {
    if (!url || typeof url !== "string") return "/placeholder.svg?height=200&width=350"
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("/uploads/")) return `http://localhost:5000${url}`
    return url
  }