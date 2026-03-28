import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { isSupabaseConfigured } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { Package, ChevronDown, CheckCircle, Clock, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '../types';

export const OrderHistory: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            setLoading(true);
            try {
                if (isSupabaseConfigured) {
                    const { data, error } = await supabase
                        .from('orders')
                        .select(`
                            *,
                            order_items (
                                *,
                                product:products (*)
                            )
                        `)
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    setOrders(data as Order[]);
                } else {
                    // Mock fallback
                    const mockOrdersRaw = localStorage.getItem('athm_mock_orders');
                    if (mockOrdersRaw) {
                        const parsed = JSON.parse(mockOrdersRaw) as Order[];
                        const userOrders = parsed.filter(o => o.user_id === user.id).sort((a, b) => 
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        );
                        setOrders(userOrders);
                    }
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return <CheckCircle size={18} color="#10b981" />;
            case 'shipped': return <Truck size={18} color="#3b82f6" />;
            default: return <Clock size={18} color="var(--color-gold)" />;
        }
    };

    if (loading) {
        return <div style={{ color: 'var(--color-text-muted)', padding: '2rem', textAlign: 'center' }}>Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '3rem',
                borderRadius: '12px',
                border: '1px dashed rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem',
                color: 'var(--color-text-muted)'
            }}>
                <Package size={48} opacity={0.5} />
                <h3 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>No Orders Yet</h3>
                <p style={{ margin: 0 }}>When you purchase items, they will appear here.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                
                return (
                    <motion.div 
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Summary Header */}
                        <div 
                            onClick={() => toggleExpand(order.id)}
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent'}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>
                                        Order {order.id.slice(0, 8).toUpperCase()}
                                    </span>
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: '6px', 
                                        fontSize: '0.85rem',
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        textTransform: 'capitalize'
                                    }}>
                                        {getStatusIcon(order.status)} {order.status}
                                    </div>
                                </div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    {new Date(order.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total</div>
                                    <div style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {formatPrice(order.total_amount)}
                                    </div>
                                </div>
                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                    <ChevronDown color="var(--color-text-muted)" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                        <h4 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1rem' }}>Items in this order</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {order.order_items?.map(item => (
                                                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                                                    {item.product?.imageUrl ? (
                                                        <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    ) : (
                                                        <div style={{ width: '50px', height: '50px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Image</div>
                                                    )}
                                                    
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ color: 'white', fontWeight: 500 }}>{item.product?.name || 'Unknown Product'}</div>
                                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity} × {formatPrice(item.price_at_purchase)}</div>
                                                    </div>
                                                    
                                                    <div style={{ fontWeight: 'bold', color: 'white' }}>
                                                        {formatPrice(item.quantity * item.price_at_purchase)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Shipping Address</h4>
                                            <p style={{ margin: 0, color: 'white', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                                {order.shipping_address?.line1}<br />
                                                {order.shipping_address?.city}, {order.shipping_address?.postal_code}<br />
                                                {order.shipping_address?.country}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};
