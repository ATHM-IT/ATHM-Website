import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { CategoryNav } from '../components/CategoryNav';

export const BrandPage: React.FC = () => {
    const { brandName } = useParams<{ brandName: string }>();
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();

    const decodedBrand = brandName ? decodeURIComponent(brandName) : '';

    const brandProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(p => p.brand === decodedBrand);
    }, [products, decodedBrand]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CategoryNav onSelectCategory={() => navigate('/')} />
            
            <div style={{ padding: '4rem 2rem', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
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
                    <ArrowLeft size={20} /> Back to Home
                </button>

                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {decodedBrand} Collection
                </h1>
                
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>
                    Explore all verified hardware and accessories officially manufactured by {decodedBrand}.
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>Loading brand products...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>Error: {error}</div>
                ) : brandProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        No products found for {decodedBrand}.
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem',
                    }}>
                        {brandProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
