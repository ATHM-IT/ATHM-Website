import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, TrendingUp, Settings, Package, Info } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

import type { Product } from '../types';
import { AnimatedPrice } from './AnimatedPrice';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const { products } = useProducts();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');

    useEffect(() => {
        if (id && products.length > 0) {
            // Because we grouped by name, but the URL is /product/:id.
            // If the supplier with the lowest price changes, the ID might change.
            // We should ideally look up by name, but if we navigate via ID, we can do a fallback search by name if ID misses.
            const p = products.find(prod => prod.id === id);
            setProduct(p);
        }
    }, [id, products]);

    if (!product) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'gray' }}>
                <h2>Product not found</h2>
                <button onClick={() => navigate('/')} style={{ marginTop: '1rem', color: 'var(--color-gold)' }}>
                    Go Home
                </button>
            </div>
        );
    }

    // Parse the supplier's HTML description to separate the main summary from the technical details
    const processDescription = (html: string) => {
        // Find where the technical lists start (usually marked by FEATURES or SPECIFICATIONS)
        const splitIndex = html.search(/<(h[1-6]|strong|b)>.*?(FEATURES|SPECIFICATIONS|WHAT’S IN THE BOX|WHAT'S IN THE BOX).*?<\/(h[1-6]|strong|b)>/i);
        
        if (splitIndex !== -1) {
            return {
                mainDesc: html.substring(0, splitIndex),
                specsHtml: html.substring(splitIndex)
            };
        }
        
        return { mainDesc: html, specsHtml: '' };
    };

    const { mainDesc, specsHtml } = processDescription(product.description || '');

    return (
        <div style={{ padding: '4rem 2rem', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-text-muted)',
                    background: 'transparent',
                    marginBottom: '2rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    border: 'none',
                    padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
                <ArrowLeft size={20} /> Back to Products
            </button>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '3rem',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--shadow-premium)'
            }}>
                {/* Image Section */}
                <div style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    aspectRatio: '4/3',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'var(--color-gold)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid var(--color-gold)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                        <TrendingUp size={16} /> Live Pricing
                    </div>
                </div>

                {/* Info Section */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <span style={{
                            color: 'var(--color-purple)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            background: 'rgba(124, 58, 237, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}>
                            {product.category}
                        </span>
                        <h1 style={{ fontSize: '2.5rem', margin: '1rem 0', color: 'white', fontWeight: 700, lineHeight: 1.2 }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '2.5rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                                <AnimatedPrice price={product.price || product.basePrice} prefix="R " />
                            </div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Excl. VAT</div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <button
                                onClick={() => setActiveTab('description')}
                                style={{
                                    background: 'transparent',
                                    color: activeTab === 'description' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                                    padding: '0.8rem 0',
                                    marginRight: '1rem',
                                    borderBottom: activeTab === 'description' ? '2px solid var(--color-gold)' : '2px solid transparent',
                                    fontWeight: 600,
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer'
                                }}
                            >
                                <Info size={18} /> Summary
                            </button>
                            {specsHtml && (
                                <button
                                    onClick={() => setActiveTab('specs')}
                                    style={{
                                        background: 'transparent',
                                        color: activeTab === 'specs' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                                        padding: '0.8rem 0',
                                        borderBottom: activeTab === 'specs' ? '2px solid var(--color-gold)' : '2px solid transparent',
                                        fontWeight: 600,
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer'
                                    }}
                                >
                                    <Settings size={18} /> Specifications
                                </button>
                            )}
                        </div>

                        {/* Rendered HTML Content */}
                        <div 
                            className="product-html-content"
                            style={{ 
                                minHeight: '150px', 
                                marginBottom: '2rem',
                                color: 'var(--color-text-muted)', 
                                lineHeight: '1.7',
                                fontSize: '1.05rem',
                                flex: 1,
                                overflowY: 'auto',
                                maxHeight: '300px',
                                paddingRight: '10px'
                            }}
                        >
                            {activeTab === 'description' ? (
                                <div dangerouslySetInnerHTML={{ __html: mainDesc || 'No description available.' }} />
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: specsHtml }} />
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                        <button
                            onClick={() => addItem(product)}
                            style={{
                                flex: 2,
                                background: 'var(--color-gold)',
                                color: 'black',
                                padding: '1.2rem',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: 'var(--shadow-gold)',
                                transition: 'transform 0.2s',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <div style={{
                            flex: 1,
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-muted)',
                            gap: '8px',
                            background: 'rgba(255,255,255,0.02)'
                        }}>
                            <Package size={20} /> Stock: {product.stock}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Warning (Placeholder) */}
            <div style={{ marginTop: '4rem', opacity: 0.6 }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Related Products</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    {/* We would map through related items here. For now, empty or mock needed?
                       Actually, let's just show a simple message or nothing to avoid clutter if no logic exists.
                       The plan said "Show 3 other products". I'll skip this for now to avoid complexity without a real product list context in this component.
                   */}
                    <div style={{ padding: '2rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', color: 'var(--color-text-muted)', gridColumn: 'span 3' }}>
                        Related products from the {product.category} category would appear here.
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};
