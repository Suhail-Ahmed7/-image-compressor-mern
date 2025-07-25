import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ImageResize.css';
import { toast } from 'react-toastify';

const ImageResize = () => {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // 👈 Added for redirection

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleWidthChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setWidth(value > 0 ? value : '');
  };

  const handleHeightChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setHeight(value > 0 ? value : '');
  };

  const handleDownload = () => {
    const token = localStorage.getItem('token'); // 👈 Check login
    if (!token) {
      toast.error("Please login first to download the image.");
      navigate('/login');
      return;
    }

    if (!file || !canvasRef.current) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const link = document.createElement('a');
      link.download = 'resized-image.png';
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  return (
    <div className="resize-container">
      <div className="resize-split">
        {/* Left Panel - Controls */}
        <div className="resize-options">
          <h1>Image Resizer</h1>
          
          <label className={`drop-zone ${file ? 'has-file' : ''}`}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              required 
            />
            {file ? (
              <>
                <div className="drop-zone-icon">✅</div>
                <div className="drop-zone-text">{file.name}</div>
                <div className="drop-zone-hint">Click to change image</div>
              </>
            ) : (
              <>
                <div className="drop-zone-icon">📤</div>
                <div className="drop-zone-text">Drag & drop image here</div>
                <div className="drop-zone-hint">or click to browse</div>
              </>
            )}
          </label>

          <div className="resize-controls">
            <div className="input-group">
              <label htmlFor="width">Width (px)</label>
              <input
                id="width"
                type="number"
                value={width}
                onChange={handleWidthChange}
                min="1"
              />
            </div>
            <div className="input-group">
              <label htmlFor="height">Height (px)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={handleHeightChange}
                min="1"
              />
            </div>
          </div>

          {file && (
            <button className="download-btn" onClick={handleDownload}>
              Download Resized Image
            </button>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="resize-preview">
          <div className="preview-container">
            {file ? (
              <>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="preview-image"
                  style={{ 
                    width: width ? `${width}px` : 'auto',
                    height: height ? `${height}px` : 'auto'
                  }}
                />
                <div className="preview-meta">
                  {width || 'auto'} × {height || 'auto'} pixels
                </div>
              </>
            ) : (
              <div className="preview-placeholder">
                <div className="preview-placeholder-icon">🖼️</div>
                <p>Your resized image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default ImageResize;
