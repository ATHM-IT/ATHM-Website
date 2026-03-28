import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supplierService } from '../services/SupplierPriceService';
import { AnimatedPrice } from './AnimatedPrice';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
    const { cart: items, isOpen, total, updateQuantity, removeItem, toggleCart } = useCart();
    const navigate = useNavigate();

    // Total is now calculated in useCart, but we can double check or just use the hook's value.
    // The hook value is: const total = cart.reduce((sum, item) => sum + (item.price || item.basePrice || 0) * item.quantity, 0);
    // The component was doing: const livePrice = supplierService.calculateRetailPrice(item.basePrice);
    // Let's stick to the hook's total for consistency, or re-calculate if we want "live" price updates that the hook doesn't do.
    // effectiveTotal matches the hook's logic if we want to rely on the hook.

    if (!isOpen) return null;

    return (
        <>
            <div
                onClick={toggleCart}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                }}
            />
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '400px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid var(--glass-border)',
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.5rem' }}>Your Cart ({items.length})</h2>
                    <button onClick={toggleCart} style={{ background: 'transparent', color: 'white', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '50px' }}>
                            <div style={{ marginBottom: '1rem', opacity: 0.5 }}><ShoppingCart size={48} /></div>
                            Your cart is empty.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <AnimatePresence mode="popLayout">
                            {items.map(item => {
                                const livePrice = supplierService.calculateRetailPrice(item.basePrice);
                                return (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={item.id} 
                                        style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}
                                    >
                                        <img src={item.imageUrl} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'white' }}>{item.name}</h4>
                                            <div style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                                                <AnimatedPrice price={livePrice} prefix="R " />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    style={{ padding: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}>
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    style={{ padding: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{ background: 'transparent', color: '#ef4444', height: 'fit-content', opacity: 0.7 }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--color-gold)' }}><AnimatedPrice price={total} prefix="R " /></span>
                    </div>
                    <button
                        onClick={() => {
                            toggleCart();
                            navigate('/checkout');
                        }}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'var(--color-gold)',
                            color: 'black',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            boxShadow: 'var(--shadow-gold)',
                            marginBottom: '1rem',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Checkout
                    </button>

                    {/* Trust Badges */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', opacity: 0.6 }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Secured by Stripe</div>
                        {/* We could use icons here, for now text or simple layout is fine as placeholder for "Visas" */}
                    </div>
                </div>
            </div>
        </>
    );
};

