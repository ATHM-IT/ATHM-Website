import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Share2, ShoppingCart, Calculator } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AnimatedPrice } from '../components/AnimatedPrice';

export const SharedBuild: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const { addItem } = useCart();

    const itemsParam = searchParams.get('items');

    const sharedProducts = useMemo(() => {
        if (!itemsParam || !products.length) return [];
        const ids = itemsParam.split(',');
        return products.filter(p => ids.includes(p.id));
    }, [itemsParam, products]);

    const totalBuildCost = useMemo(() => {
        return sharedProducts.reduce((sum, p) => sum + (p.price || p.basePrice), 0);
    }, [sharedProducts]);

    const handleAddAllToCart = () => {
        sharedProducts.forEach(p => addItem(p));
        navigate('/cart');
    };

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>Loading build...</div>;
    }

    if (!itemsParam || sharedProducts.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <h2>Invalid or Empty Build Link</h2>
                <button onClick={() => navigate('/')} style={{ marginTop: '1rem', color: 'var(--color-gold)', background: 'transparent', border: '1px solid var(--color-gold)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Browse Components
                </button>
            </div>
        );
    }

    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--color-purple)', padding: '8px 16px', borderRadius: '50px', marginBottom: '1rem', fontWeight: 'bold' }}>
                    <Share2 size={16} /> Shared Custom Build
                </div>
                <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>Check out this rig!</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Someone has curated this high-performance list of components. You can add them all to your cart below.
                </p>
            </div>

            <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--glass-border)', 
                padding: '2rem', 
                borderRadius: '16px', 
                marginBottom: '3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Calculator size={32} color="var(--color-gold)" />
                    <div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Custom Build Cost</span>
                        <div style={{ fontSize: '2rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                            <AnimatedPrice price={totalBuildCost} prefix="R " />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleAddAllToCart}
                    style={{
                        padding: '1rem 2rem',
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <ShoppingCart size={20} /> Add Build To Cart
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {sharedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};
