// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { useState } from 'react';

function App() {
  // This state will help us manage authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login onLoginSuccess={() => setIsAuthenticated(true)} /> : 
            <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
            <Register /> : 
            <Navigate to="/dashboard" />
          } 
        />
        
        {/* Protected routes - need authentication */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <div>Dashboard (coming soon)</div> : 
            <Navigate to="/login" />
          } 
        />
        
        {/* Default route */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;