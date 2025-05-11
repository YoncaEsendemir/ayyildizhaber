const authService = require("../services/authService")
const cookie = require("cookie-parser")
const dotenv = require("dotenv")

dotenv.config()

const register = async (req, res) => {
  const { name, email, password } = req.body //İstek gövdesinden email ve password değerlerini alır

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur!" })
  }

  try {
    const result = await authService.registerAdmin(name, email, password)
    res.status(201).json(result) // 201 tekili başarılı bir şekide giriş yaptı
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await authService.loginAdmin(email, password)
    res.cookie("token", result.token, {
      httpOnly: true, // Js tarafından erişilemez
      secure: process.env.NODE_ENV === "production", //sadece HTTPS üzerinden çalışsın
      sameSite: "strict", // CSRF'ye karşı koruma
    })
    res.status(200).json(result)
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
}

const getDashboard = async (req, res) => {
  try {
    // JWT middleware'den gelen kullanıcı bilgisini kullan
    const adminId = req.user.adminId
    const result = await authService.getDashboard(adminId)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ message: "Server hatası", error: err.message })
  }
}

const logout = (req, res) => {
  try {
    // Cookie'yi temizle
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    
    res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
  } catch (error) {
    res.status(500).json({ message: "Çıkış yapılırken bir hata oluştu" });
  }
};

module.exports = {
  register,
  login,
  getDashboard,
  logout
}
