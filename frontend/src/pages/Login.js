import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 
import API_URL from '../apiConfig'; // Import the config

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // UPDATED: Now uses the dynamic API_URL from apiConfig.js
            const { data } = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            // Save token to local storage
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            // Redirect to dashboard
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="login-wrapper">
            {/* Dark overlay to make text pop against background */}
            <div className="login-overlay"></div>
            
            <div className="login-box">
                <h2>Login</h2>
                
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;