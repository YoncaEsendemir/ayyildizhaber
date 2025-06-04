const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destination = req.query.destination || 'uploads';
    const uploadDir = path.join(process.cwd(), 'public', destination);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    req.uploadPath = destination; // Burada set ediyoruz
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
 // const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];

 if (allowedImageTypes.includes(file.mimetype)) {
  // Sadece resim tipleri kontrol ediliyor
  cb(null, true)
} else {
  cb(new Error("Sadece .jpeg, .jpg, .png formatlarına izin verilmektedir."), false) // Hata mesajı güncellendi
}
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB 
  }
});

module.exports = upload;
