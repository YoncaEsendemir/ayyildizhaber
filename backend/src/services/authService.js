const db = require("../config/db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

dotenv.config()

const registerAdmin = async (name, email, password) => {
  try {
    const [existingAdmin] = await db.query("SELECT * FROM admin_table WHERE email = ?", [email]) // email varsa hata versin
    if (existingAdmin.length > 0) {
      throw new Error("Email zaten kayıtlı")
    }
    const hashedPassword = await bcrypt.hash(password.toString(), 10)
    await db.query("INSERT INTO admin_table (name,email,password) VALUES (?,?,?)", [name, email, hashedPassword])

    return { message: "Kayıt başarılı" }
  } catch (err) {
    console.error("registerda hata var")
    throw err
  }
}

const loginAdmin = async (email, password) => {
  try {
    const [admins] = await db.query("SELECT * FROM admin_table WHERE email = ?", [email])
    const admin = admins[0]
    if (!admin) throw new Error("Geçersiz email veya şifre")

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) throw new Error("Geçersiz email veya şifre")
    /* jwt, genellikle jsonwebtoken adlı bir JavaScript kütüphanesinin bir nesnesidir. Bu kütüphane, JWT oluşturma ve doğrulama işlemlerini kolaylaştırmak için 
        kullanılır. Bu satırda, sign() metodu çağrılarak yeni bir JWT oluşturulur. */
    const token = jwt.sign({ adminId: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    //jwt.sigt() : Kullanıcı bilgilerini içeren bir JWT oluşturur. Token'ın içeriği:userId ve email
    //Token'ın imzalanması için JWT_Secret kullınılır , token'ın geçerlilk süresi JWT_EXPIRES_IN ile belirlenir
    //Başarılı giriş mesajı ve token döner
    return { message: "Login is successful", token }
  } catch (err) {
    console.error("Giriş hatası:", err.message)
    throw err
  }
}


const getDashboard = async (id) => {
    try {
      const [admin] = await db.query("SELECT * FROM admin_table WHERE id= ?", [id]);
      if (!admin || admin.length === 0) {
        return { message: "Admin kayıt yok" };
      }
  
      return admin[0]; // sadece ilk kullanıcı
    } catch (err) {
      console.error("Admin bulunamadı", err);
      throw err;
    }
  };
  

module.exports = {
  registerAdmin,
  loginAdmin,
  getDashboard
}
