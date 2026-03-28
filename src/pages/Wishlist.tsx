import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Wishlist: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const { products } = useProducts();

    // Create a derived state for wishlist items from the products list
    // This is better than fetching individually
    const wishlistProducts = React.useMemo(() => {
        if (!user || !products.length) return [];
        return products.filter(p => user.wishlist.includes(p.id));
    }, [user, products]);

    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <h2 style={{
                fontSize: '2.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
            }}>
                <Heart fill="var(--color-gold)" color="var(--color-gold)" /> My Wishlist
            </h2>

            {wishlistProducts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '4rem' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your wishlist is empty.</p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'var(--color-gold)',
                            color: 'black',
                            padding: '1rem 2rem',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {wishlistProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};
