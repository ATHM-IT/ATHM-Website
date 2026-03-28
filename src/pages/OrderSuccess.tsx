import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: 'white',
            textAlign: 'center'
        }}>
            <div style={{
                background: 'var(--glass-bg)',
                padding: '4rem 3rem',
                borderRadius: '24px',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--shadow-premium)',
                maxWidth: '600px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div style={{
                    position: 'relative',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '2px solid #10b981',
                        opacity: 0.5,
                        animation: 'ping 2s infinite'
                    }} />
                    <CheckCircle size={48} color="#10b981" />
                </div>

                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Order Confirmed!
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Thank you for your purchase. Your order has been securely placed and sent to our team.
                        <br />
                        You will receive an email confirmation shortly.
                    </p>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }} />

                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'var(--color-gold)',
                        color: 'black',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'transform 0.2s',
                        boxShadow: 'var(--shadow-gold)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <ShoppingBag size={20} /> Continue Shopping
                </button>
            </div>

            <style>{`
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
