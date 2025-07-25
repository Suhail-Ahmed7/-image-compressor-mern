import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import '../styles/ImageConverter.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ✅ Add this

const ImageConverter = () => {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('png');
  const [convertedURL, setConvertedURL] = useState(null);
  const navigate = useNavigate(); // ✅ Add this

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setConvertedURL(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setConvertedURL(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleConvert = () => {
    if (!file) {
      toast.error("Please upload an image first.");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const mimeType = `image/${format}`;
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setConvertedURL(url);
            toast.success(`Successfully converted to .${format}`);
          } else {
            toast.error("Failed to convert image.");
          }
        }, mimeType);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleDownload = (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault(); // 🛑 stop link navigation
      toast.error("Please login first to download the image.");
      navigate('/login');
    }
  };

  return (
    <div className="converter-wrapper">
      <div className="converter-card">
        <h2>Image Converter</h2>
        <p className="subtitle">Convert your image to another format instantly.</p>

        <div
          className={`upload-box ${file ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CloudUploadIcon style={{ fontSize: 48, color: '#3f51b5' }} />
          <p>{file ? file.name : 'Drag & Drop or Click to Upload'}</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden-file-input"
          />
        </div>

        <div className="options">
          <label htmlFor="format">Convert To:</label>
          <select id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
            <option value="bmp">BMP</option>
            <option value="tiff">TIFF</option>
          </select>
        </div>

        <button className="convert-btn" onClick={handleConvert}>
          <SwapHorizIcon style={{ marginRight: 8 }} />
          Convert Image
        </button>

        {convertedURL && (
          <a
            href={convertedURL}
            download={`converted-image.${format}`}
            onClick={handleDownload} // ✅ Check auth before download
          >
            <button className="download-btn">
              <DownloadIcon style={{ marginRight: 8 }} />
              Download
            </button>
          </a>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;
