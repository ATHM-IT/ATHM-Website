import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, TrendingUp, Settings, Package, Info, ChevronRight, Star, CheckCircle2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
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
            {/* Breadcrumb Navigation */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: 'var(--color-text-muted)', 
                fontSize: '0.9rem',
                marginBottom: '2rem' 
            }}>
                <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--color-text-muted)' }}>{product.category}</span>
                <ChevronRight size={14} />
                <span style={{ color: 'white', fontWeight: 600 }}>{product.name.split(' ').slice(0, 3).join(' ')}...</span>
            </div>

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
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        zIndex: 10
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
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Incl. VAT & Fees</div>
                        </div>

                        {/* Inventory Status (Polish) */}
                        <div style={{ 
                            marginBottom: '2rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            {product.stock > 10 ? (
                                <>
                                    <CheckCircle2 color="#10b981" size={20} />
                                    <span style={{ color: '#10b981', fontWeight: 600 }}>In Stock - Ready for Dispatch</span>
                                </>
                            ) : product.stock > 0 ? (
                                <>
                                    <Clock color="#f59e0b" size={20} />
                                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>Limited Stock Available ({product.stock})</span>
                                </>
                            ) : (
                                <>
                                    <Info color="#ef4444" size={20} />
                                    <span style={{ color: '#ef4444', fontWeight: 600 }}>Out of Stock - Contact for Lead Time</span>
                                </>
                            )}
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
            <div style={{ marginTop: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'white', fontSize: '1.5rem' }}>Related Products</h3>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--color-gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Category <ChevronRight size={16} />
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    <div style={{ padding: '2rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center', color: 'var(--color-text-muted)', gridColumn: 'span 3' }}>
                        High-performance {product.category} components that pair well with your selection.
                    </div>
                </div>
            </div>

            {/* Social Proof Placeholder (Task 3 Add-on) */}
            <div style={{ marginTop: '6rem', maxWidth: '800px' }}>
                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Star size={24} color="var(--color-gold)" fill="var(--color-gold)" /> Customer Reviews
                </h3>
                <div style={{ 
                    padding: '3rem', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '24px', 
                    border: '1px solid var(--glass-border)',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Be the first to review this {product.category.toLowerCase()}.
                    </p>
                    <button style={{
                        padding: '0.8rem 2rem',
                        background: 'transparent',
                        border: '1px solid var(--color-gold)',
                        color: 'var(--color-gold)',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>Write a Review</button>
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
