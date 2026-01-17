import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <form onSubmit={handleSignup} style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Register
                </button>
                <p style={{ marginTop: '10px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;