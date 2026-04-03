import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const PaymentBadge = ({ name, color }: { name: string, color: string }) => (
    <div style={{
        padding: '4px 10px',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.1)',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
        {name}
    </div>
);

export const Footer: React.FC = () => {
    return (
        <footer
            className="tech-grid-bg"
            style={{
                borderTop: '1px solid var(--glass-border)',
                background: 'rgba(2, 2, 5, 0.8)',
                backdropFilter: 'blur(20px)',
                padding: '5rem 2rem 2rem',
                marginTop: 'auto'
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '4rem',
                marginBottom: '4rem'
            }}>
                {/* Brand Column */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            background: 'var(--color-gold)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '900', color: 'black', fontSize: '1.2rem'
                        }}>A</div>
                        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>ATHM</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '1.05rem' }}>
                        The premiere destination for high-performance hardware and enterprise-scale IT solutions in South Africa.
                    </p>
                    <div style={{ display: 'flex', gap: '1.2rem', color: 'var(--color-text-muted)' }}>
                        <Facebook size={22} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                        <Twitter size={22} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                        <Instagram size={22} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                        <Linkedin size={22} style={{ cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <h4 style={{ color: 'white', marginBottom: '2rem', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['About Us', 'Solutions', 'Contact Us', 'Our Partners'].map(item => (
                            <li key={item}>
                                <a href={`/${item.toLowerCase().replace(' ', '-')}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '1rem' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h4 style={{ color: 'white', marginBottom: '2rem', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal & Support</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Returns Policy', 'Shipping Info', 'Privacy Policy', 'Terms of Service', 'FAQ'].map(item => (
                            <li key={item}>
                                <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '1rem' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 style={{ color: 'white', marginBottom: '2rem', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--color-text-muted)' }}>
                        <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <MapPin size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                            <span>155 West Street, Sandton,<br/>Johannesburg, 2196</span>
                        </li>
                        <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Mail size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                            <span>support@athm.co.za</span>
                        </li>
                        <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Phone size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                            <span>+27 (0) 11 555 0123</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar with Payment Trust */}
            <div style={{
                paddingTop: '2.5rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem'
            }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} ATHM International (PTY) LTD. All rights reserved.
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Payments by</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <PaymentBadge name="Visa" color="#1a1f71" />
                        <PaymentBadge name="Mastercard" color="#eb001b" />
                        <PaymentBadge name="PayFast" color="#ff4500" />
                        <PaymentBadge name="Instant EFT" color="#00bcd4" />
                    </div>
                </div>
            </div>
        </footer>
    );
};
