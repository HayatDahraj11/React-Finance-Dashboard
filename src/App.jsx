// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { useState } from 'react';

// Temporary Dashboard component
const Dashboard = () => {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>Welcome to Dashboard</h1>
      <p>Your financial management dashboard is coming soon!</p>
    </div>
  );
};

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
              <Dashboard /> : 
              <Navigate to="/login" />
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />

        {/* Catch all route for undefined paths */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;