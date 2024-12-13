// src/contexts/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        
        // Fetch user data after successful login
        const userResponse = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'An error occurred during login' 
      };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: 'Registration successful' };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'An error occurred during registration' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          return true;
        } else {
          logout();
          return false;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
        return false;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        register, 
        checkAuth,
        isAuthenticated: !!token 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;