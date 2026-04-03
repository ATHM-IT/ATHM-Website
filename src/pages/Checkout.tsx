import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { isSupabaseConfigured } from '../supabaseClient';
import { ShieldCheck, CreditCard, Truck, ExternalLink } from 'lucide-react';

const PAYFAST_MERCHANT_ID = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100';
const PAYFAST_MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694581a';
const PAYFAST_URL = import.meta.env.VITE_PAYFAST_URL || 'https://sandbox.payfast.co.za/eng/process';

export const Checkout: React.FC = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [loading, setLoading] = useState(false);

    const SHIPPING_THRESHOLD = 5000;
    const FLAT_RATE_SHIPPING = 150;
    
    const shippingCost = total >= SHIPPING_THRESHOLD ? 0 : FLAT_RATE_SHIPPING;
    const finalTotal = total + shippingCost;

    const [address, setAddress] = useState({
        line1: '',
        city: '',
        postal_code: '',
        country: 'South Africa'
    });

    if (cart.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>
                <h2>Your cart is empty</h2>
                <button
                    onClick={() => navigate('/')}
                    style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', background: 'var(--color-gold)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    const handlePayFastRedirect = async () => {
        if (!user) {
            alert('Please log in to place an order');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            let orderId = '';

            if (isSupabaseConfigured) {
                // 1. Create Order in 'pending' status
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        user_id: user.id,
                        total_amount: finalTotal,
                        shipping_address: address,
                        status: 'pending' // Default status before payment
                    })
                    .select()
                    .single();

                if (orderError) throw orderError;
                orderId = order.id;

                // 2. Create Order Items
                const orderItems = cart.map(item => ({
                    order_id: order.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price || item.currentPrice || 0
                }));

                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems);

                if (itemsError) throw itemsError;
            } else {
                orderId = crypto.randomUUID();
            }

            // 3. Construct PayFast Form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = PAYFAST_URL;

            const fields: { [key: string]: string } = {
                merchant_id: PAYFAST_MERCHANT_ID,
                merchant_key: PAYFAST_MERCHANT_KEY,
                return_url: window.location.origin + '/order-success',
                cancel_url: window.location.origin + '/checkout',
                notify_url: 'https://athm-webhooks.vercel.app/api/payfast-itn', // Placeholder
                name_first: user.name.split(' ')[0],
                email_address: user.email,
                m_payment_id: orderId,
                amount: finalTotal.toFixed(2),
                item_name: `ATHM Order #${orderId.slice(0, 8)}`,
                custom_str1: 'Checkout'
            };

            for (const key in fields) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields[key];
                form.appendChild(input);
            }

            // 4. Submit Form and redirect
            document.body.appendChild(form);
            
            // Clear cart before redirecting
            clearCart();
            
            form.submit();

        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Failed to initialize payment: ${error.message}`);
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                opacity: step === 1 ? 1 : 0.5,
                color: step === 1 ? 'var(--color-gold)' : 'white'
            }}>
                <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: step === 1 ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                    color: step === 1 ? 'black' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>1</div>
                <span>Shipping</span>
            </div>
            <div style={{ width: '50px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                opacity: step === 2 ? 1 : 0.5,
                color: step === 2 ? 'var(--color-gold)' : 'white'
            }}>
                <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: step === 2 ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                    color: step === 2 ? 'black' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>2</div>
                <span>Payment</span>
            </div>
        </div>
    );

    const inputStyle = {
        padding: '1rem',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        color: 'white',
        width: '100%',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh', color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                Secure Checkout
            </h1>

            {renderStepIndicator()}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
                {/* Left Column: Forms */}
                <div>
                    {step === 1 && (
                        <div style={{ background: 'var(--glass-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-premium)' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '1.5rem' }}>
                                <Truck size={24} color="var(--color-gold)" /> Shipping Address
                            </h2>
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Street Address</label>
                                    <input
                                        required
                                        placeholder="123 Main St"
                                        value={address.line1}
                                        onChange={e => setAddress({ ...address, line1: e.target.value })}
                                        style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>City</label>
                                        <input
                                            required
                                            placeholder="Cape Town"
                                            value={address.city}
                                            onChange={e => setAddress({ ...address, city: e.target.value })}
                                            style={inputStyle}
                                            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Postal Code</label>
                                        <input
                                            required
                                            placeholder="8001"
                                            value={address.postal_code}
                                            onChange={e => setAddress({ ...address, postal_code: e.target.value })}
                                            style={inputStyle}
                                            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        marginTop: '1rem',
                                        padding: '1.2rem',
                                        background: 'var(--color-gold)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        transition: 'transform 0.2s',
                                        boxShadow: 'var(--shadow-gold)'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Continue to Payment
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ background: 'var(--glass-bg)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-premium)' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '1.5rem' }}>
                                <CreditCard size={24} color="var(--color-gold)" /> Secure Payment
                            </h2>
                            <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', marginBottom: '2rem' }}>
                                <p style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                                    <ShieldCheck size={24} /> 256-bit SSL Connection
                                </p>
                            </div>
                            
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                                You will be redirected to the secure **PayFast** portal to complete your transaction using Card or Instant EFT.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setStep(1)}
                                    style={{ flex: 1, padding: '1.2rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
                                >
                                    Back
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handlePayFastRedirect}
                                    style={{
                                        flex: 2,
                                        padding: '1.2rem',
                                        background: 'var(--color-gold)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        boxShadow: 'var(--shadow-gold)'
                                    }}
                                >
                                    {loading ? 'Initializing...' : (
                                        <>Pay ZAR {finalTotal.toFixed(2)} <ExternalLink size={20} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', height: 'fit-content', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Order Summary</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '10px' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                                            {item.quantity}x
                                        </div>
                                    </div>
                                    <span>{item.name}</span>
                                </div>
                                <span style={{ fontWeight: 600 }}>R {((item.price || 0) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                            <span>Subtotal</span>
                            <span>R {total.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
                            <span>Shipping (Courier)</span>
                            <span style={{ color: shippingCost === 0 ? '#10b981' : 'inherit', fontWeight: shippingCost === 0 ? 'bold' : 'normal' }}>
                                {shippingCost === 0 ? 'FREE' : `R ${shippingCost.toFixed(2)}`}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.5rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--color-gold)' }}>R {finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
