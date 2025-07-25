const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises; // Use promises API for async operations

const convertImageFormat = async (req, res) => {
  try {
    console.log("Received request:", req.body, req.files);
    // Extract format from form data
    const format = req.body.format?.toLowerCase();
    const file = req.files && req.files["file"] && req.files["file"][0]; // Access the uploaded file

    if (!file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const validFormats = ["jpeg", "jpg", "png", "webp", "avif"];
    if (!format || !validFormats.includes(format)) {
      console.error("Invalid format:", format);
      return res.status(400).json({ error: "Invalid format requested" });
    }

    const convertedDir = path.join(__dirname, "..", "converted");
    if (!(await fs.access(convertedDir).then(() => true).catch(() => false))) {
      console.log("Creating converted directory:", convertedDir);
      await fs.mkdir(convertedDir, { recursive: true });
    } else {
      console.log("Converted directory exists:", convertedDir);
    }

    const ext = format === "jpg" ? "jpeg" : format;
    const outputFileName = `converted-${Date.now()}.${format}`;
    const outputPath = path.join(convertedDir, outputFileName);

    console.log("Converting file:", file.path, "to", outputPath);
    await sharp(file.path).toFormat(ext).toFile(outputPath);
    console.log("Conversion successful");

    // Asynchronous delete with retry, skip if still busy
    const deleteFile = async (path, retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          await fs.unlink(path);
          console.log("Original file deleted:", path);
          return;
        } catch (err) {
          if (err.code === "EBUSY" && i < retries - 1) {
            console.warn("File busy, retrying...", path, i + 1);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            console.warn("Failed to delete file due to lock, skipping:", err);
            return; // Skip deletion instead of throwing
          }
        }
      }
    };

    await deleteFile(file.path);

    res.status(200).json({
      message: "Image converted successfully",
      file: outputFileName,
      format,
      path: `/converted/${outputFileName}`,
    });
  } catch (error) {
    console.error("Conversion error:", error.message, error.stack);
    res.status(500).json({ error: "Image conversion failed", details: error.message });
  }
};

module.exports = { convertImageFormat };  
