import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        return () => document.head.removeChild(style);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const result = await register(formData.email, formData.password);
            if (result.success) {
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please login with your credentials.'
                    }
                });
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred during registration.');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

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
                <div style={{ textAlign: 'center', marginBottom: '35px', position: 'relative', zIndex: 1 }}>
                    <h2 style={{
                        fontSize: '30px',
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
                        Create Account
                    </h2>
                </div>

                {error && (
                    <div style={{
                        color: '#e74c3c',
                        marginBottom: '20px',
                        textAlign: 'center',
                        padding: '15px',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(231, 76, 60, 0.2)',
                        animation: 'shake 0.5s ease-out'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '14px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '14px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '14px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div style={{
                    marginTop: '20px',
                    textAlign: 'center'
                }}>
                    <Link
                        to="/login"
                        style={{
                            color: '#3498db',
                            textDecoration: 'none',
                            fontSize: '15px'
                        }}
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
