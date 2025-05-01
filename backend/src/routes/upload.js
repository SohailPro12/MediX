/* hada mam7tajinoch daba */


/* const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");
const fs = require("fs");
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// 📂 Configuration `multer`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// 📌 Route d'upload
router.post("/:type",authMiddleware, upload.single("image"), uploadImage);

module.exports = router; */
