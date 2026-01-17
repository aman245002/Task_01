import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>User Profile</h2>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Name</label>
                <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)} 
                    style={{ padding: '8px' }} 
                />
                
                <label>Email</label>
                <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    style={{ padding: '8px' }} 
                />

                <label>New Password (leave blank to keep current)</label>
                <input 
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter new password"
                    style={{ padding: '8px' }} 
                />

                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Update Profile
                </button>
            </form>

            <hr style={{ margin: '20px 0' }} />

            <button 
                onClick={handleDelete} 
                style={{ width: '100%', padding: '10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                Delete Account
            </button>
            
            <button 
                onClick={() => navigate('/')} 
                style={{ width: '100%', padding: '10px', marginTop: '10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default Profile;