// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Authentication logic will be implemented later
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Welcome Back</h2>
        {/* Login form implementation */}
      </div>
    </div>
  );
};

export default Login;

// src/pages/auth/Register.jsx
// Similar structure to Login, but with additional fields for registration