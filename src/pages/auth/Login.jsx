import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// LoadingScreen component - preserved exactly as is
const LoadingScreen = () => {
    useEffect(() => {
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
    
    // State management
    const [pageLoading, setPageLoading] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
    const [isLoading, setIsLoading] = useState(false);
    
    // UI interaction states
    const [isEmailHovered, setIsEmailHovered] = useState(false);
    const [isPasswordHovered, setIsPasswordHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (pageLoading) return <LoadingScreen />;

    // Rest of the component remains exactly the same
    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(-45deg, #1a1f2b, #2c3e50, #2980b9, #3498db)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 20% 30%, rgba(52, 152, 219, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(41, 128, 185, 0.05) 0%, transparent 50%)
                `,
                backgroundSize: '100% 100%',
                opacity: 0.6,
                animation: 'float 10s ease-in-out infinite'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 100px rgba(52,152,219,0.1)',
                padding: '35px',
                margin: '20px',
                transform: 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.8s ease-out'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '35px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <h1 style={{
                        fontSize: '38px',
                        fontWeight: '800',
                        margin: '0 0 10px 0',
                        background: 'linear-gradient(45deg, #2c3e50, #3498db, #2980b9)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'gradient 5s ease infinite',
                        letterSpacing: '-0.5px',
                        textShadow: '0 2px 10px rgba(52,152,219,0.1)'
                    }}>
                        WealthGuard Pro
                    </h1>
                    <p style={{
                        color: '#7f8c8d',
                        fontSize: '16px',
                        letterSpacing: '0.5px',
                        margin: '0',
                        opacity: 0.9
                    }}>
                        Secure Your Financial Future
                    </p>
                </div>

                {successMessage && (
                    <div style={{
                        color: '#27ae60',
                        marginBottom: '20px',
                        textAlign: 'center',
                        padding: '15px',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(39, 174, 96, 0.2)',
                        animation: 'slideDown 0.4s ease-out',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }}>
                        <span role="img" aria-label="success">✅ </span>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div style={{
                        color: '#e74c3c',
                        marginBottom: '20px',
                        textAlign: 'center',
                        padding: '15px',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(231, 76, 60, 0.2)',
                        animation: 'shake 0.5s ease-out',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }}>
                        <span role="img" aria-label="error">⚠️ </span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ 
                        marginBottom: '20px', 
                        position: 'relative',
                        transition: 'all 0.3s ease' 
                    }}>
                        <input
                            type="email"
                            placeholder=""
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            onFocus={() => setIsEmailHovered(true)}
                            onBlur={() => setIsEmailHovered(false)}
                            onMouseEnter={() => setIsEmailHovered(true)}
                            onMouseLeave={() => setIsEmailHovered(false)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                paddingLeft: '45px',
                                border: '2px solid',
                                borderColor: isEmailHovered ? '#3498db' : '#e0e0e0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                backgroundColor: isEmailHovered ? '#f8fafc' : 'white',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                boxSizing: 'border-box',
                                boxShadow: isEmailHovered ? '0 2px 8px rgba(52,152,219,0.15)' : 'none'
                            }}
                            required
                            disabled={isLoading}
                            aria-label="Email Address"
                        />
                        <label style={{
                            position: 'absolute',
                            left: '45px',
                            top: formData.email ? '0' : '50%',
                            transform: formData.email ? 'translateY(-50%) scale(0.8)' : 'translateY(-50%)',
                            color: isEmailHovered ? '#3498db' : '#95a5a6',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'white',
                            padding: '0 5px',
                            pointerEvents: 'none'
                        }}>
                            Email Address
                        </label>
                        <span style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '20px',
                            opacity: isEmailHovered ? 1 : 0.7,
                            transition: 'all 0.3s ease'
                        }}>
                            📧
                        </span>
                    </div>

                    <div style={{ 
                        marginBottom: '25px', 
                        position: 'relative' 
                    }}>
                        <input
                            type="password"
                            placeholder=""
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            onFocus={() => setIsPasswordHovered(true)}
                            onBlur={() => setIsPasswordHovered(false)}
                            onMouseEnter={() => setIsPasswordHovered(true)}
                            onMouseLeave={() => setIsPasswordHovered(false)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                paddingLeft: '45px',
                                border: '2px solid',
                                borderColor: isPasswordHovered ? '#3498db' : '#e0e0e0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                backgroundColor: isPasswordHovered ? '#f8fafc' : 'white',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                boxSizing: 'border-box',
                                boxShadow: isPasswordHovered ? '0 2px 8px rgba(52,152,219,0.15)' : 'none'
                            }}
                            required
                            disabled={isLoading}
                            aria-label="Password"
                        />
                        <label style={{
                            position: 'absolute',
                            left: '45px',
                            top: formData.password ? '0' : '50%',
                            transform: formData.password ? 'translateY(-50%) scale(0.8)' : 'translateY(-50%)',
                            color: isPasswordHovered ? '#3498db' : '#95a5a6',
                            transition: 'all 0.3s ease',
                            backgroundColor: 'white',
                            padding: '0 5px',
                            pointerEvents: 'none'
                        }}>
                            Password
                        </label>
                        <span style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '20px',
                            opacity: isPasswordHovered ? 1 : 0.7,
                            transition: 'all 0.3s ease'
                        }}>
                            🔒
                        </span>
                    </div>

                    <button
                        type="submit"
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: isButtonHovered ? '#2980b9' : '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isButtonHovered 
                                ? '0 8px 15px rgba(52,152,219,0.3)' 
                                : '0 4px 6px rgba(52,152,219,0.1)',
                            opacity: isLoading ? 0.7 : 1,
                            transform: isButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        disabled={isLoading}
                    >
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            {isLoading ? (
                                <>
                                    <span style={{ 
                                        animation: 'spin 1s linear infinite',
                                        display: 'inline-block'
                                    }}>🔄</span>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    Login
                                </>
                            )}
                        </span>
                    </button>

                    <div style={{
                        marginTop: '30px',
                        textAlign: 'center',
                        padding: '15px',
                        background: 'linear-gradient(to right, rgba(52,152,219,0.05), rgba(41,128,185,0.05))',
                        borderRadius: '12px',
                        border: '1px solid rgba(52,152,219,0.1)',
                        animation: 'fadeIn 0.5s ease-out',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Link
                            to="/register"
                            style={{
                                display: 'inline-block',
                                color: '#3498db',
                                textDecoration: 'none',
                                fontSize: '15px',
                                fontWeight: '500',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                background: 'transparent',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(52,152,219,0.1)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <span style={{ marginRight: '8px' }}>🌟</span>
                            Don't have an account? Register
                        </Link>
                    </div>

                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: '#95a5a6',
                        opacity: 0.8
                    }}>
                        <p style={{ margin: '5px 0' }}>
                            Secure login • 256-bit encryption
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;