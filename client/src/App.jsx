import React from 'react';
import LoginPage from './pages/LoginPage';
import Signup from './pages/Signup';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImageCompressor from './pages/ImageCompressor';
import HeaderComponent from './pages/HeaderComponent';
import ImageConverter from './pages/ImageConverter';
import ImageResize from './pages/ImageResize';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <HeaderComponent />
      <div>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/compress" element={<ImageCompressor />} />
          <Route path="/convert" element={<ImageConverter />} />
          <Route path="/resize" element={<ImageResize />} />
        </Routes>
        <ToastContainer
          position="top-right"
          style={{ marginTop: 58}}
          autoClose={2000}
        />
      </div>
    </Router>
  );
}

export default App;