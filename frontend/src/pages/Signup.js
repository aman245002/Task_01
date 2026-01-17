import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reusing the shared CSS for consistency

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password
            });
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Signup Failed');
        }
    };

    return (
        // Overriding the background image inline to be different from Login
        <div 
            className="login-wrapper" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="login-overlay"></div>
            
            <div className="login-box">
                <h2>Create Account</h2>
                
                <form onSubmit={handleSignup}>
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="Choose a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Using a Blue button for Signup to differentiate from Login's Green */}
                    <button type="submit" className="login-btn" style={{ background: '#007bff' }}>
                        Register
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;