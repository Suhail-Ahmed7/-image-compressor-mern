const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const compressImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = file.path;
    if (!fs.existsSync(inputPath)) {
      return res.status(400).json({ error: "Uploaded file not found on server" });
    }

    const compressedDir = path.join(__dirname, "../compressed");
    if (!fs.existsSync(compressedDir)) {
      try {
        fs.mkdirSync(compressedDir, { recursive: true });
      } catch (err) {
        return res.status(500).json({ error: "Failed to create compressed directory", details: err.message });
      }
    }

    const baseName = `compressed-${Date.now()}`;
    const webpFileName = `${baseName}.webp`;
    const webpPath = path.join(compressedDir, webpFileName);

    // Compress to WebP
    await sharp(inputPath)
      .webp({ quality: 30 })
      .toFile(webpPath);

    console.log(`WebP file saved at: ${webpPath}`);
    const webpStats = fs.statSync(webpPath);
    console.log(`WebP file size: ${webpStats.size} bytes`);
    if (webpStats.size === 0) {
      throw new Error("WebP file is empty");
    }
    if (webpStats.size > file.size) {
      console.log("WebP size larger than original, trying optimized PNG...");
      const pngFileName = `${baseName}.png`;
      const pngPath = path.join(compressedDir, pngFileName);
      await sharp(inputPath)
        .png({ quality: 20, compressionLevel: 9, effort: 10 })
        .toFile(pngPath);
      const pngStats = fs.statSync(pngPath);
      console.log(`PNG file saved at: ${pngPath}, Size: ${pngStats.size} bytes`);
      fs.unlinkSync(webpPath); // Remove oversized WebP
      fs.unlinkSync(inputPath); // Clean up original
      return res.status(200).json({ url: `/compressed/${pngFileName}` });
    }

    fs.unlinkSync(inputPath); // Clean up original after successful WebP
    res.status(200).json({ url: `/compressed/${webpFileName}` });
  } catch (error) {
    console.error("Compression error:", error.stack);
    // Clean up any partial files if they exist
    const webpPath = path.join(__dirname, "../compressed", `compressed-${Date.now()}.webp`);
    const pngPath = path.join(__dirname, "../compressed", `compressed-${Date.now()}.png`);
    [webpPath, pngPath, req.file?.path].forEach((path) => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });
    res.status(500).json({ error: "Image compression failed", details: error.message });
  }
};

module.exports = {
  compressImage,
};