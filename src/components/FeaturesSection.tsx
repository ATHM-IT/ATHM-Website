import React from 'react';
import { Truck, ShieldCheck, Zap, Globe } from 'lucide-react';

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        transition: 'var(--transition-smooth)'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--color-gold)';
            e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        <div style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{description}</p>
    </div>
);

export const FeaturesSection: React.FC = () => {
    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                <FeatureItem
                    icon={<Zap size={32} />}
                    title="High Performance"
                    description="Top-tier hardware optimized for maximum efficiency and speed."
                />
                <FeatureItem
                    icon={<ShieldCheck size={32} />}
                    title="Secure & Reliable"
                    description="Enterprise-grade security and 24/7 dedicated support."
                />
                <FeatureItem
                    icon={<Globe size={32} />}
                    title="Global Shipping"
                    description="Fast and insured delivery to over 50 countries worldwide."
                />
                <FeatureItem
                    icon={<Truck size={32} />}
                    title="Real-Time Tracking"
                    description="Track your order status instantly from our dashboard."
                />
            </div>
        </section>
    );
};
