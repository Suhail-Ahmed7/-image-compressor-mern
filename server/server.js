const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const imageConverterRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes')
dotenv.config();
require('./config/dbConnection')();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving with download forced
app.use("/compressed", express.static(path.join(__dirname, "compressed"), {
  setHeaders: (res) => {
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="compressed-image.png"'
    });
  }
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/converted', express.static(path.join(__dirname, 'converted'), {
  setHeaders: (res, path) => {
    const ext = path.split('.').pop();
    if (ext === 'png') {
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="converted-image.png"'
      });
    } else if (ext === 'jpeg' || ext === 'jpg') {
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename="converted-image.jpg"'
      });
    } else if (ext === 'webp') {
      res.set({
        'Content-Type': 'image/webp',
        'Content-Disposition': 'attachment; filename="converted-image.webp"'
      });
    } else if (ext === 'avif') {
      res.set({
        'Content-Type': 'image/avif',
        'Content-Disposition': 'attachment; filename="converted-image.avif"'
      });
    }
  }
}));

// Routes
const imageRoutes = require("./routes/imageRoutes");
app.use('/api', authRoutes)
app.use("/api/image", imageRoutes);
app.use('/api/images', imageConverterRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});