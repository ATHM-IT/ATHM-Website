import React from 'react';
import { Cloud, Shield, Server, Headphones, ArrowRight, CheckCircle } from 'lucide-react';
const ServiceCard: React.FC<{ icon: React.ReactNode, title: string, description: string, features: string[] }> = ({ icon, title, description, features }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-premium)';
            e.currentTarget.style.borderColor = 'var(--color-gold-glow)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
    >
        <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'rgba(251, 191, 36, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-gold)'
        }}>
            {icon}
        </div>

        <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'white' }}>{title}</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{description}</p>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
            {features.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                    <CheckCircle size={16} color="var(--color-gold)" />
                    <span style={{ fontSize: '0.9rem' }}>{feature}</span>
                </li>
            ))}
        </ul>

        <button style={{
            marginTop: 'auto',
            padding: '0.8rem',
            background: 'transparent',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-gold)';
                e.currentTarget.style.color = 'black';
                e.currentTarget.style.borderColor = 'var(--color-gold)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
        >
            Learn More <ArrowRight size={16} />
        </button>
    </div>
);

export const Solutions: React.FC = () => {
    return (
        <div style={{ color: 'white' }}>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 2rem',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px',
                        background: 'var(--color-purple)', filter: 'blur(150px)', opacity: 0.2
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px',
                        background: 'var(--color-gold)', filter: 'blur(150px)', opacity: 0.1
                    }} />
                </div>

                <div style={{ maxWidth: '800px' }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Future-Proof Your Business
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Transform your digital infrastructure with our enterprise-grade solutions.
                        We bridge the gap between today's needs and tomorrow's possibilities.
                    </p>
                    <button style={{
                        padding: '1rem 2.5rem',
                        background: 'var(--color-gold)',
                        color: 'black',
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        boxShadow: 'var(--shadow-gold)'
                    }}>
                        Get a Consultation
                    </button>
                </div>
            </section>

            {/* Services Grid */}
            <section style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <ServiceCard
                        icon={<Headphones size={32} />}
                        title="SLA Maintenance Support"
                        description="Keep your business running without downtime. Our proactive monitoring and remote support ensure your team stays productive."
                        features={['Unlimited Remote Support', 'On-Site Callouts', 'Monthly Health Reports']}
                    />
                    <ServiceCard
                        icon={<Server size={32} />}
                        title="Network Installations"
                        description="From simple office Wi-Fi to complex server room cabling. We design and install robust networks using premium Ubiquiti gear."
                        features={['Cat6 Cabling', 'Wi-Fi Planning', 'Server Rack Cleanups']}
                    />
                    <ServiceCard
                        icon={<Shield size={32} />}
                        title="Cybersecurity & Backup"
                        description="Protect your business data from ransomware. We implement zero-trust security policies and automated cloud backups."
                        features={['ESET/Bitdefender Antivirus', 'Cloud Backups', 'Firewall Configuration']}
                    />
                    <ServiceCard
                        icon={<Cloud size={32} />}
                        title="Software Licensing"
                        description="Stop worrying about compliance. We manage your Microsoft 365, Adobe, and other software subscriptions at competitive rates."
                        features={['Microsoft 365 Admin', 'Adobe Creative Cloud', 'License Audits']}
                    />
                </div>
            </section>

            {/* Trust Section */}
            <section style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid var(--glass-border)'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Trusted by Industry Leaders</h2>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '4rem',
                    opacity: 0.5,
                    filter: 'grayscale(100%)'
                }}>
                    {/* Mock Logos - simple text for now, could be replaced with SVGs */}
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>TECHCORP</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>NEXUS</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>GLOBAL DYNAMICS</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>CYBERDYNE</span>
                </div>
            </section>
        </div>
    );
};
