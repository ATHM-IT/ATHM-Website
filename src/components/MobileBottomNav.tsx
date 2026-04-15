import React from 'react';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, toggleCart } = useCart();
    const { user } = useAuth();

    const tabs = [
        { name: 'Home', path: '/', icon: <Home size={22} /> },
        { name: 'Search', path: '/search', icon: <Search size={22} /> },
        { name: 'Cart', path: 'cart', icon: <ShoppingCart size={22} /> },
        { name: 'Profile', path: user ? '/profile' : '/login', icon: <User size={22} /> },
    ];

    const isCurrent = (path: string) => {
        if (path === '/search') return false; // Handled specially
        if (path === 'cart') return false; // Handled specially popup
        return location.pathname === path;
    };

    const handleNavigation = (path: string) => {
        if (path === 'cart') {
            toggleCart();
        } else if (path === '/search') {
            // Focus global top search, or scroll to top and open search modal. Since Search is on navbar, we can navigate home and focus search. 
            // For simplicity, navigate home with a query state, or use window scrolling.
            navigate('/');
            // Add a slight delay to allow navigation
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // We'll dispatch a custom event to open the search bar in the navbar
                window.dispatchEvent(new CustomEvent('open-search-modal'));
            }, 100);
        } else {
            navigate(path);
        }
    };

    return (
        <div className="mobile-only mobile-bottom-nav">
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                background: 'rgba(10, 10, 15, 0.95)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid var(--glass-border)',
                padding: '0.8rem 0',
                paddingBottom: 'calc(0.8rem + env(safe-area-inset-bottom))'
            }}>
                {tabs.map(tab => (
                    <div 
                        key={tab.name}
                        onClick={() => handleNavigation(tab.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isCurrent(tab.path) ? 'var(--color-gold)' : 'var(--color-text-muted)',
                            cursor: 'pointer',
                            position: 'relative',
                            flex: 1
                        }}
                    >
                        {tab.icon}
                        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{tab.name}</span>
                        
                        {tab.name === 'Cart' && cart.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: -5,
                                right: 'calc(50% - 20px)',
                                background: 'var(--color-gold)',
                                color: 'black',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '0.6rem',
                                fontWeight: 'bold'
                            }}>
                                {cart.length}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <style>{`
                .mobile-bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    z-index: 1000;
                }
            `}</style>
        </div>
    );
};
