import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; // 1. Import Profile

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* 2. Add Profile Route */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Set Dashboard as the main landing page */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Redirect any unknown pages back to Dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;