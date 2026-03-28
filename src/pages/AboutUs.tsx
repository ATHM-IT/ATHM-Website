import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Zap, Server, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, delay = 0 }: { icon: React.ReactNode, title: string, description: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay }}
        style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-premium)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}
        whileHover={{
            y: -5,
            boxShadow: 'var(--shadow-gold)'
        }}
    >
        <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
        }} />
        <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            padding: '1rem',
            borderRadius: '12px',
            color: 'var(--color-gold)'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'white' }}>{title}</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{description}</p>
    </motion.div>
);

export const AboutUs: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem', overflow: 'hidden' }}>
            {/* HERO SECTION */}
            <section style={{
                position: 'relative',
                padding: '8rem 2rem 6rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ maxWidth: '900px', margin: '0 auto' }}
                >
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(135deg, #ffffff 0%, #d4af37 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 10px rgba(212, 175, 55, 0.2))'
                    }}>
                        Powering the Digital Future of South Africa.
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        color: 'var(--color-text-muted)',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: 1.7,
                        fontWeight: 300
                    }}>
                        ATHM is a vanguard electronics distributor built on the foundation of uncompromising quality. We bridge the gap between world-class hardware manufacturers and local innovators, gamers, and enterprises.
                    </p>
                </motion.div>
            </section>

            {/* MISSION STATEMENT (GLASSMORPHISM) */}
            <section style={{ padding: '0 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '24px',
                        padding: '4rem',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative glowing orb */}
                    <div style={{
                        position: 'absolute',
                        top: '0%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '100px',
                        background: 'var(--color-gold)',
                        filter: 'blur(100px)',
                        opacity: 0.15,
                        pointerEvents: 'none'
                    }} />

                    <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '2rem' }}>Our Mission</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.8, maxWidth: '800px', margin: '0 auto' }}>
                        In an era defined by computing power, seamless networking, and lightning-fast storage, settling for sub-par hardware is not an option. Our mission is to curate and supply the absolute pinnacle of technological components directly from global suppliers. Whether you are building an enterprise server room or fine-tuning an esports battlestation, ATHM guarantees origin-verified excellence.
                    </p>
                </motion.div>
            </section>

            {/* WHY CHOOSE US GRID */}
            <section style={{ padding: '0 2rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'white' }}>The ATHM Standard</h2>
                    <div style={{ width: '60px', height: '3px', background: 'var(--color-gold)', margin: '1rem auto' }} />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <FeatureCard 
                        icon={<Award size={32} />} 
                        title="Authorized Retailer" 
                        description="We partner directly with tier-1 global suppliers to guarantee 100% authentic equipment, backed by full manufacturer warranties."
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={<Truck size={32} />} 
                        title="Nationwide Logistics" 
                        description="From Cape Town to Johannesburg, our elite courier network ensures your sensitive hardware arrives safely and rapidly."
                        delay={0.2}
                    />
                    <FeatureCard 
                        icon={<ShieldCheck size={32} />} 
                        title="Ironclad Security" 
                        description="Enjoy peace of mind with our 256-bit encrypted checkout and ultra-secure payment gateway protocols."
                        delay={0.3}
                    />
                    <FeatureCard 
                        icon={<Zap size={32} />} 
                        title="Unmatched Speed" 
                        description="Our specialized real-time inventory system means the moment a product enters our warehouse, it's ready to process and ship to your door."
                        delay={0.4}
                    />
                    <FeatureCard 
                        icon={<Server size={32} />} 
                        title="Enterprise Scale" 
                        description="Need 100 workstations? 50 miles of Cat6 cable? We specialize in bulk sourcing directly from importers."
                        delay={0.5}
                    />
                    <FeatureCard 
                        icon={<Users size={32} />} 
                        title="Expert Consultation" 
                        description="Our support team consists of hardware enthusiasts and IT professionals ready to assist with complex compatibility queries."
                        delay={0.6}
                    />
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section style={{ padding: '0 2rem', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        padding: '4rem 2rem',
                        background: 'linear-gradient(90deg, #111 0%, #1a1a1a 100%)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}
                >
                    <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>Ready to upgrade your arsenal?</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        Browse our latest shipments of next-gen hardware.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            padding: '1.2rem 3rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: 'black',
                            background: 'var(--color-gold)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-gold)',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Explore Products
                    </button>
                </motion.div>
            </section>
        </div>
    );
};
