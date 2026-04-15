import React, { useState } from 'react';
import { Send, Headphones, Box, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export const Support: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        orderNumber: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const ticketData = {
            id: `tic_${Date.now()}`,
            user_id: user?.id || 'anonymous',
            name: formData.name,
            email: formData.email,
            order_number: formData.orderNumber,
            subject: formData.subject,
            message: formData.message,
            status: 'open',
            created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured) {
            const { error: supabaseError } = await supabase.from('tickets').insert(ticketData);
            if (supabaseError) {
                setError("Failed to log ticket to database: " + supabaseError.message);
                setIsSubmitting(false);
                return;
            }
        }

        setSubmitted(true);
        setIsSubmitting(false);
    };

    const actionCards = [
        {
            title: 'Track an Order',
            description: 'Check the status of your hardware shipment.',
            icon: <Search size={24} color="var(--color-gold)" />,
            action: () => window.location.href = '/profile'
        },
        {
            title: 'Start a Return',
            description: 'Lodge an RMA request or return of items.',
            icon: <Box size={24} color="var(--color-gold)" />,
            action: () => setFormData({ ...formData, subject: 'RMA / Return Request' })
        },
        {
            title: 'Technical Support',
            description: 'Ask our experts about motherboard or GPU setups.',
            icon: <Headphones size={24} color="var(--color-gold)" />,
            action: () => setFormData({ ...formData, subject: 'Technical Hardware Support' })
        }
    ];

    return (
        <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '1rem', fontWeight: 800 }}>ATHM Support Portal</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Need help with an order, complex hardware setup, or warranty query? Our team is ready to assist.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
            }}>
                {actionCards.map((card, idx) => (
                    <div 
                        key={idx} 
                        onClick={card.action}
                        style={{
                            padding: '2rem',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            textAlign: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ marginBottom: '1rem', display: 'inline-block' }}>{card.icon}</div>
                        <h3 style={{ color: 'white', marginBottom: '0.8rem' }}>{card.title}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{card.description}</p>
                    </div>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: '4rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                padding: '3rem',
                alignItems: 'start'
            }}>
                {/* Contact Info Column */}
                <div style={{ color: 'white' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Submit a Ticket</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Direct contact with the ATHM Tech Team. We pride ourselves on fast turnaround for all hardware and software compatibility requests.
                    </p>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                            <span>Current Status: Systems Online</span>
                        </div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            Expected Response Time: <strong>Within 4 Hours (Business Hours)</strong>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Business Hours</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Mon - Fri: 08:30 - 17:00</p>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Sat: 09:00 - 13:00</p>
                    </div>
                </div>

                {/* Ticket Form Column */}
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Ticket Lodged Successfully!</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                                Your support ticket has been received. We've sent a confirmation email to {formData.email}. Reference: {Date.now().toString().slice(-6)}
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                style={{
                                    padding: '0.8rem 2rem',
                                    background: 'transparent',
                                    border: '1px solid var(--color-gold)',
                                    color: 'var(--color-gold)',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Submit Another Inquiry
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {error && (
                                <div style={{ 
                                    padding: '1rem', 
                                    background: 'rgba(239,68,68,0.1)', 
                                    border: '1px solid #ef4444', 
                                    borderRadius: '8px', 
                                    color: '#ef4444', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px' 
                                }}>
                                    <AlertCircle size={20} /> {error}
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Your Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Order Number (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. #ORD-12345"
                                    value={formData.orderNumber}
                                    onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Topic / Subject</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Warranty Claim, Technical Issue"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Your Message</label>
                                <textarea 
                                    required
                                    rows={5}
                                    placeholder="Please provide details about your issue..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', outline: 'none', resize: 'none' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '1.2rem',
                                    background: 'var(--color-gold)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    transition: 'opacity 0.2s',
                                    boxShadow: 'var(--shadow-gold)',
                                    marginTop: '1rem',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                <Send size={20} /> {isSubmitting ? 'Sending Ticket...' : 'Lodge Support Ticket'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    div[style*="grid-template-columns: 1fr 1.5fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
};
