import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Heart, Copy } from 'lucide-react';
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

    const [copied, setCopied] = React.useState(false);

    const handleShare = () => {
        const itemIds = wishlistProducts.map(p => p.id).join(',');
        const url = `${window.location.origin}/build?items=${itemIds}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    margin: 0,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <Heart fill="var(--color-gold)" color="var(--color-gold)" /> My Wishlist
                </h2>

                {wishlistProducts.length > 0 && (
                    <button 
                        onClick={handleShare}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <Copy size={18} /> {copied ? 'Copied to Clipboard!' : 'Share Custom Build'}
                    </button>
                )}
            </div>

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
