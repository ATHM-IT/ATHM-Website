import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer
            className="tech-grid-bg"
            style={{
                borderTop: '1px solid var(--color-purple-glow)',
                boxShadow: '0 -4px 30px rgba(124, 58, 237, 0.1)',
                padding: '4rem 2rem 1rem',
                marginTop: 'auto'
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '3rem',
                marginBottom: '3rem'
            }}>
                {/* Brand Column */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            background: 'var(--color-gold)',
                            borderRadius: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', color: 'black'
                        }}>A</div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>ATHM</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        Elevating your digital experience with premium hardware and software solutions.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)' }}>
                        <Facebook size={20} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                        <Twitter size={20} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                        <Instagram size={20} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                        <Linkedin size={20} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'} />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {['Products', 'Solutions', 'About Us', 'Contact', 'FAQ'].map(item => (
                            <li key={item}>
                                <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
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
                    <h4 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>Contact</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <li>123 Tech Avenue, Silicon Valley</li>
                        <li>support@athm.com</li>
                        <li>+1 (555) 123-4567</li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>Newsletter</h4>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Subscribe for the latest tech drops and exclusive offers.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="email"
                            placeholder="Your email"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                padding: '0.8rem',
                                borderRadius: '4px',
                                flex: 1,
                                outline: 'none'
                            }}
                        />
                        <button style={{
                            background: 'var(--color-gold)',
                            color: 'black',
                            border: 'none',
                            padding: '0.8rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--color-text-muted)',
                fontSize: '0.8rem'
            }}>
                <p>&copy; {new Date().getFullYear()} ATHM International. All rights reserved.</p>
            </div>
        </footer>
    );
};
