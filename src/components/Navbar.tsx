import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEditor } from '../context/EditorContext'; // Added this import
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const { user } = useAuth();
    const { cart, toggleCart } = useCart();
    const { toggleEditing } = useEditor();
    const navigate = useNavigate();
    const [logoPosition, setLogoPosition] = useState({ x: 20, y: 20 });

    useEffect(() => {
        // Listen for theme changes from the customizer
        const handleThemeChange = (e: CustomEvent) => {
            if (e.detail) {
                setLogoPosition({ x: e.detail.logoX, y: e.detail.logoY });
            }
        };

        // Load initial interaction if saved
        const saved = localStorage.getItem('athm-theme-settings');
        if (saved) {
            const settings = JSON.parse(saved);
            setLogoPosition({ x: settings.logoX, y: settings.logoY });
        }

        window.addEventListener('theme-change', handleThemeChange as EventListener);
        return () => window.removeEventListener('theme-change', handleThemeChange as EventListener);
    }, []);

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 2rem',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Dynamic Logo Container */}
            <div style={{
                position: 'relative', // Relative to the nav flow, but we can offset it
                transform: `translate(${logoPosition.x}px, ${logoPosition.y}px)`,
                transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
            }} onClick={() => navigate('/')}>
                <img
                    src="/ATHM logo.jpg"
                    alt="ATHM Logo"
                    style={{ height: '50px', objectFit: 'contain', border: '1px solid var(--color-gold)', borderRadius: '4px' }}
                />
                {/* Optional Text fallback or tagline if needed, can be toggled later */}
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--color-gold)',
                    letterSpacing: '2px',
                    display: 'none' // Hiding text in favor of image
                }}>
                    ATHM
                </span>
            </div>

            <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-muted)' }}>
                <a onClick={() => navigate('/')} style={{ color: 'var(--color-text-main)', cursor: 'pointer' }}>Products</a>
                <a onClick={() => navigate('/solutions')} style={{ cursor: 'pointer' }}>Solutions</a>
                <a style={{ cursor: 'pointer' }}>Support</a>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-gold)', alignItems: 'center' }}>
                <Search size={24} style={{ cursor: 'pointer' }} />

                <div
                    onClick={() => user ? navigate('/profile') : navigate('/login')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    title={user ? 'My Profile' : 'Login / Sign Up'}
                >
                    <User size={24} />
                    {user && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.9rem', color: 'white', lineHeight: '1' }}>{user.name}</span>
                            {user.isAdmin && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/admin');
                                    }}
                                    style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--color-gold)',
                                        cursor: 'pointer',
                                        marginTop: '2px',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Dashboard
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={toggleCart}
                        style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <ShoppingCart size={24} />
                    </button>
                    {cart.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: 'var(--color-gold)',
                            color: 'black',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}>
                            {cart.length}
                        </div>
                    )}
                </div>
                <Menu size={24} style={{ cursor: 'pointer' }} onClick={toggleEditing} />
            </div>
        </nav>
    );
};
