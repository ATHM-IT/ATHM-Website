import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Zap, Server, Users, Award, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, delay = 0 }: { icon: React.ReactNode, title: string, description: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay }}
        style={{
            background: 'rgba(255, 255, 255, 0.02)',
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
            borderColor: 'var(--color-gold)',
            background: 'rgba(212, 175, 55, 0.03)'
        }}
    >
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
    
    // Using the generated premium image
    const heroImage = '/premium_hardware_showroom_1775248033840.png';

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem', overflow: 'hidden', background: '#020205' }}>
            {/* HERO SECTION */}
            <section style={{
                position: 'relative',
                height: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 2rem',
                overflow: 'hidden'
            }}>
                {/* Background Image with Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at center, rgba(2, 2, 5, 0.4) 0%, rgba(2, 2, 5, 1) 100%)',
                        zIndex: 1
                    }} />
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.7 }}
                        transition={{ duration: 1.5 }}
                        src={heroImage}
                        alt="ATHM Premium Showroom"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{ maxWidth: '1000px', position: 'relative', zIndex: 10 }}
                >
                    <span style={{ 
                        color: 'var(--color-gold)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '4px', 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        display: 'block'
                    }}>
                        Technological Vanguard
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        color: 'white',
                        letterSpacing: '-0.02em'
                    }}>
                        Defining Excellence in <br/>
                        <span style={{ 
                            background: 'linear-gradient(135deg, #fff 0%, #d4af37 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>South African Hardware.</span>
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '750px',
                        margin: '0 auto',
                        lineHeight: 1.7,
                        fontWeight: 300
                    }}>
                        ATHM is more than a distributor. We are the architects of high-performance infrastructure, bridging the gap between global Tier-1 manufacturers and the local visionaries leading South Africa's digital revolution.
                    </p>
                </motion.div>
            </section>

            {/* MISSION STATEMENT (PREMIUM GLASS) */}
            <section style={{ padding: '0 2rem 8rem', maxWidth: '1300px', margin: '-5rem auto 0', position: 'relative', zIndex: 20 }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{
                        background: 'rgba(10, 10, 15, 0.8)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderTopColor: 'rgba(212, 175, 55, 0.3)',
                        borderRadius: '32px',
                        padding: '5rem 4rem',
                        textAlign: 'center',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ width: '40px', height: '2px', background: 'var(--color-gold)' }} />
                        <h2 style={{ fontSize: '2.5rem', color: 'white', fontWeight: 700 }}>Our Vision</h2>
                        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: '900px', fontWeight: 300 }}>
                            In an era where data is the new currency and efficiency is the ultimate competitive advantage, ATHM stands as the guardian of quality. We curate and supply the absolute pinnacle of technological components directly to South Africa's leading enterprises, data centers, and advanced laboratories. Whether you are scaling an AI cluster or securing a nationwide network, we provide the ironclad foundation your mission demands.
                        </p>
                        <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-gold)' }}>10k+</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.5rem' }}>SKUs Managed</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-gold)' }}>24h</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.5rem' }}>Dispatch Goal</div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-gold)' }}>100%</div>
                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.5rem' }}>ZAR Compliant</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* THE ATHM STANDARD GRID */}
            <section style={{ padding: '0 2rem 8rem', maxWidth: '1300px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', color: 'white', fontWeight: 800, letterSpacing: '-0.03em' }}>The ATHM Standard</h2>
                    <p style={{ color: 'var(--color-gold)', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.9rem', marginTop: '1rem' }}>No Compromises. Just Performance.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2.5rem'
                }}>
                    <FeatureCard 
                        icon={<Award size={32} />} 
                        title="Authorized Tier-1 Partner" 
                        description="We bypass the middlemen. By partnering directly with global manufacturers, we guarantee authentic, origin-verified hardware with full warranty support."
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={<Truck size={32} />} 
                        title="Elite Nationwide Logistics" 
                        description="Our proprietary fulfillment network ensures rapid, climate-controlled delivery across South Africa, from Sandton and Umhlanga to the V&A Waterfront."
                        delay={0.2}
                    />
                    <FeatureCard 
                        icon={<ShieldCheck size={32} />} 
                        title="Enterprise-Grade Security" 
                        description="Security is not an afterthought. Our platform utilizes 256-bit encryption and PayFast verified protocols to ensure every transaction is ironclad."
                        delay={0.3}
                    />
                    <FeatureCard 
                        icon={<Server size={32} />} 
                        title="Bulk Infrastructure Sourcing" 
                        description="We specialize in large-scale deployments. Whether equipping a new office park or a private server farm, we provide the scale required."
                        delay={0.4}
                    />
                    <FeatureCard 
                        icon={<Zap size={32} />} 
                        title="Real-Time Supply Chain" 
                        description="Our systems are directly integrated with supplier inventories, providing you with precision accuracy on stock levels and ETA data."
                        delay={0.5}
                    />
                    <FeatureCard 
                        icon={<Users size={32} />} 
                        title="Architectural Support" 
                        description="Our consultants are not just sales reps—they are systems architects. We help you design the solutions you buy from us."
                        delay={0.6}
                    />
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section style={{ padding: '0 2rem 6rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        padding: '6rem 2rem',
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(2, 2, 5, 1) 100%)',
                        borderRadius: '40px',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        maxWidth: '1000px',
                        margin: '0 auto',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}>Ready to Build the Future?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                            Join the elite network of South African enterprises powered by ATHM hardware.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            style={{
                                padding: '1.2rem 4rem',
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                color: 'black',
                                background: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.background = 'var(--color-gold)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            Explore Collection <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};
