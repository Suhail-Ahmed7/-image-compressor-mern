import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { MdEmail } from 'react-icons/md';   
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import '../styles/Signup.css';

const Signup = () => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const validateForm = () => {
        const { fullName, email, password, confirmPassword } = form;

        if (!fullName || !email || !password || !confirmPassword) {
            toast.error('All fields are required');
            return false;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        // Additional password complexity checks
        if (!/[A-Z]/.test(password)) {
            toast.error('Password must contain at least one uppercase letter');
            return false;
        }

        if (!/[a-z]/.test(password)) {
            toast.error('Password must contain at least one lowercase letter');
            return false;
        }

        if (!/[0-9]/.test(password)) {
            toast.error('Password must contain at least one number');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/signup', form);
            localStorage.setItem('token', res.data.token);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            
            let errorMessage = 'Signup failed. Please try again.';
            if (error.response) {
                if (error.response.status === 400 && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 409) {
                    errorMessage = 'This email is already registered. Please log in or use a different email.';
                }
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

      return (
        <div className="page-wrapper">
            <div className="signup-container">
                <div className="left-section"></div>

                <div className="right-section">
                    <h3>Create Account</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="input-icon-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-icon-group">
                            <MdEmail className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-icon-group">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-icon-group">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Sign Up'} <FaUserPlus className="btn-icon" />
                        </button>

                        <p className="signin-link">
                            Already have an account? <Link to="/login">Log In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;