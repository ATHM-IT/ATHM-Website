import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Shield, FileText, Truck, RefreshCw, Calendar } from 'lucide-react';
import { legalContent } from '../data/legalContent';

export const LegalPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const section = slug ? legalContent[slug] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!section) {
        return (
            <div style={{ padding: '8rem 2rem', textAlign: 'center', color: 'white' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
                <p>Legal document not found.</p>
                <button 
                    onClick={() => navigate('/')}
                    style={{ marginTop: '2rem', padding: '1rem 2rem', background: 'var(--color-gold)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Return Home
                </button>
            </div>
        );
    }

    const getIcon = (id: string) => {
        switch (id) {
            case 'privacy': return <Shield size={40} color="var(--color-gold)" />;
            case 'terms': return <FileText size={40} color="var(--color-gold)" />;
            case 'returns': return <RefreshCw size={40} color="var(--color-gold)" />;
            case 'shipping': return <Truck size={40} color="var(--color-gold)" />;
            default: return <FileText size={40} color="var(--color-gold)" />;
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#020205', padding: '8rem 2rem 6rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* BACK BUTTON */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        marginBottom: '3rem',
                        fontSize: '1rem',
                        padding: '0'
                    }}
                >
                    <ChevronLeft size={20} /> Back
                </motion.button>

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '4rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '1.5rem' }}>
                        {getIcon(section.id)}
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'white', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                            {section.title}
                        </h1>
                    </div>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '700px', lineHeight: 1.6 }}>
                        {section.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', marginTop: '2rem', fontSize: '0.9rem' }}>
                        <Calendar size={14} /> Last Updated: {section.lastUpdated}
                    </div>
                </motion.div>

                {/* CONTENT AREA */}
                <div style={{ display: 'grid', gap: '3rem' }}>
                    {section.content.map((block, index) => (
                        <motion.section
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                paddingBottom: '3rem',
                                borderBottom: index === section.content.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <h2 style={{ fontSize: '1.6rem', color: 'white', marginBottom: '1.5rem', fontWeight: 600 }}>
                                {block.title}
                            </h2>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {block.body.map((text, i) => (
                                    <p key={i} style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* FOOTER CALLOUT */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{
                        marginTop: '4rem',
                        padding: '3rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}
                >
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Have questions about our legal policies? Our support team is here to help.
                    </p>
                    <button
                        onClick={() => navigate('/support')}
                        style={{
                            padding: '1rem 2.5rem',
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Contact Support
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
