// src/pages/auth/Register.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// This component handles user registration functionality
const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Registration logic will be added later
    console.log('Registration attempt:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold">Create Account</h2>
        {/* Registration form will go here */}
      </div>
    </div>
  );
};

// Only one export default statement
export default Register;