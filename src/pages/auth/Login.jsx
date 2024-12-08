// src/pages/auth/Login.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// First, let's create our animations as a style tag that will be injected into the component
const LoadingScreen = () => {
    useEffect(() => {
        // Create and inject animations when component mounts
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Cleanup on unmount
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#1a1f2b',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                textAlign: 'center',
                animation: 'fadeIn 1s ease-out'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    margin: '0 auto',
                    border: '3px solid #3498db',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ 
                    color: '#fff', 
                    marginTop: '20px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    Loading WealthGuard Pro...
                </p>
            </div>
        </div>
    );
};

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(
        location.state?.message || ''
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Show loading screen for 1.5 seconds
        const timer = setTimeout(() => setPageLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (pageLoading) return <LoadingScreen />;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1a1f2b',
            backgroundImage: 'linear-gradient(135deg, #1a1f2b 0%, #2a3442 100%)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, transparent 20%, #1a1f2b 20%, #1a1f2b 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #1a1f2b 20%, #1a1f2b 80%, transparent 80%, transparent) 50px 50px',
                backgroundSize: '100px 100px',
                animation: 'fadeInBackground 3s ease-out',
                opacity: 0.1
            }} />

            <div style={{
                padding: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '400px',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                animation: 'slideUp 0.5s ease-out'
            }}>
                {/* Logo and Branding */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    animation: 'fadeIn 1s ease-out'
                }}>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        marginBottom: '10px',
                        background: 'linear-gradient(45deg, #2c3e50, #3498db)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        WealthGuard Pro
                    </div>
                    <p style={{
                        color: '#7f8c8d',
                        fontSize: '14px'
                    }}>
                        Secure Your Financial Future
                    </p>
                </div>

                {successMessage && (
                    <div style={{
                        color: '#27ae60',
                        marginBottom: '15px',
                        textAlign: 'center',
                        padding: '12px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '8px',
                        animation: 'slideDown 0.3s ease-out',
                        border: '1px solid #a5d6a7'
                    }}>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div style={{
                        color: '#e74c3c',
                        marginBottom: '15px',
                        textAlign: 'center',
                        padding: '12px',
                        backgroundColor: '#fde8e8',
                        borderRadius: '8px',
                        animation: 'shake 0.5s ease-out',
                        border: '1px solid #fab1a0'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '12px',
                                paddingLeft: '40px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                ':focus': {
                                    borderColor: '#3498db',
                                    boxShadow: '0 0 0 3px rgba(52,152,219,0.1)'
                                }
                            }}
                            required
                            disabled={isLoading}
                        />
                        <i style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#95a5a6'
                        }}>
                            📧
                        </i>
                    </div>

                    {/* Password input with similar styling */}
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '12px',
                                paddingLeft: '40px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            required
                            disabled={isLoading}
                        />
                        <i style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#95a5a6'
                        }}>
                            🔒
                        </i>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            transform: 'translateY(0)',
                            ':hover': {
                                backgroundColor: '#2980b9',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 5px 15px rgba(52,152,219,0.3)'
                            }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? '🔄 Logging in...' : '🚀 Login'}
                    </button>

                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        <Link
                            to="/register"
                            style={{
                                color: '#3498db',
                                textDecoration: 'none',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    color: '#2980b9',
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Don't have an account? Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default Login;