import React, { useState, useCallback } from 'react';
import '../styles/ImageCompressor.css';
import { FiUpload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ImageCompressor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setSelectedImage(file);
      setCompressedUrl(null);
    } else {
      alert('File size must be less than 10MB!');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setSelectedImage(file);
      setCompressedUrl(null);
    } else {
      alert('File size must be less than 10MB!');
    }
  };

  const handleCompress = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first to compress image.');
      return navigate('/login');
    }

    if (!selectedImage) return;

    setIsCompressing(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post("http://localhost:5000/api/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = response.data.url;
      setCompressedUrl(url);
      toast.success('Image compressed successfully!');
    } catch (error) {
      console.error('Compression failed:', error);
      toast.error('Failed to compress image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login first to download the image.");
      navigate('/login');
      return;
    }

    if (!compressedUrl) return;

    const link = document.createElement('a');
    link.href = `http://localhost:5000${compressedUrl}`;
    link.download = `compressed-${Date.now()}.png`;
    link.setAttribute('type', 'image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="compressor-wrapper horizontal">
      <div className="compressor-card">
        <h2 className="compressor-title">Image Compressor</h2>
        <p className="compressor-subtitle">
          Easily compress your image files online for free.
        </p>

        <div className="upload-box" {...getRootProps()}>
          <input {...getInputProps()} />
          <FiUpload size={40} color="#fff" />
          <input
            type="file"
            accept="image/*"
            id="upload"
            onChange={handleFileChange}
            hidden
          />
          <p className="upload-label">
            <strong>Drop your image here</strong><br />
            or click to select
          </p>
          <p className="file-note">Max file size: 10MB</p>
        </div>

        <div className="quality-section">
          <label htmlFor="quality">Choose Compression Quality</label>
          <select id="quality" className="dropdown">
            <option value="high">High Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="low">Low Quality</option>
          </select>
        </div>

        <button
          className={`compress-btn ${!selectedImage ? 'disabled' : ''}`}
          onClick={handleCompress}
          disabled={!selectedImage || isCompressing}
        >
          {isCompressing ? 'Compressing...' : 'Compress Image'}
        </button>

        {compressedUrl && localStorage.getItem('token') && (
          <button className="download-btn" onClick={handleDownload}>
            Download Compressed Image
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCompressor;
