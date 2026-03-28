import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Login failed: ' + (error as Error).message);
        }
    };

    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop) center/cover no-repeat'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: 'rgba(10, 10, 15, 0.7)',
                backdropFilter: 'blur(20px)',
                padding: '3rem',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                width: '100%',
                maxWidth: '400px',
                boxShadow: 'var(--shadow-premium)',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Welcome Back</h2>

                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <button type="submit" style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--color-gold)',
                    color: 'black',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Sign In
                </button>

                <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
                    Don't have an account? <span style={{ color: 'var(--color-gold)', cursor: 'pointer' }} onClick={() => navigate('/signup')}>Sign Up</span>
                </p>
            </form>
        </div>
    );
};
