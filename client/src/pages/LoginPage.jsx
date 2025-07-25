import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { EmailOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      localStorage.setItem('token', res.data.token);
      toast.success("Login successful! 🎉");
      navigate('/convert');
    } catch (error) {
      toast.error(error.response?.data || "Login failed.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-container">
        <div className="left-section"></div>
        <div className="right-section">
          <h3>Login</h3>
          <p className="welcome-message">Welcome back! Please login to continue.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* Email Field with Icon */}
            <div className="input-wrapper">
              <EmailOutlined className="input-icon" />
              <input
                required
                type="email"
                name="email"
                className="auth-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="input-wrapper">
              <span className="input-icon" onClick={togglePassword} style={{ cursor: 'pointer' }}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="auth-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="auth-submit">Login</button>

            <Link to="/request-otp" className="forgot-link">Forgot Password?</Link>
          </form>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
