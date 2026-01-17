import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing the glass card styles

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Helper: Get Token
    const getAuthHeader = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                'http://localhost:5000/api/auth/profile',
                { name, email, password },
                getAuthHeader()
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Profile Updated Successfully!');
            setPassword(''); // Clear password field after update
        } catch (error) {
            alert('Update Failed');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure? This will delete your account and ALL your tasks!')) {
            try {
                await axios.delete('http://localhost:5000/api/auth/profile', getAuthHeader());
                localStorage.removeItem('userInfo');
                alert('Account Deleted');
                navigate('/signup');
            } catch (error) {
                alert('Delete Failed');
            }
        }
    };

    return (
        // UPDATED IMAGE URL BELOW
        <div 
            className="login-wrapper"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2070&q=80')" }}
        >
            <div className="login-overlay"></div>
            
            <div className="login-box" style={{ maxWidth: '500px' }}>
                <h2 style={{ marginBottom: '20px' }}>Edit Profile</h2>
                
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    
                    <div>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label>New Password <small>(Leave blank to keep current)</small></label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter new password"
                        />
                    </div>

                    <button type="submit" className="login-btn" style={{ background: '#28a745', marginBottom: '15px' }}>
                        Save Changes
                    </button>
                </form>

                <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '20px 0' }} />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => navigate('/')} 
                        className="login-btn" 
                        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}
                    >
                        Back
                    </button>
                    
                    <button 
                        onClick={handleDelete} 
                        className="login-btn" 
                        style={{ background: '#dc3545' }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;