const express = require("express");
const multer = require("multer");
const path = require("path");
const { compressImage } = require("../controllers/imageController");
const { convertImageFormat } = require("../controllers/imageConverterController");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `original-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });


router.post("/upload", upload.single("image"), compressImage);

// Handle both file and format field
router.post("/convert", upload.fields([{ name: "file" }, { name: "format" }]), convertImageFormat);

module.exports = router;