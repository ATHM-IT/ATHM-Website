import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Search, Filter } from 'lucide-react';
import type { Product } from '../types';

interface ProductListProps {
    selectedCategory?: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({ selectedCategory }) => {
    const { products, loading, error } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Sync search query with URL param
    useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) {
            setSearchQuery(query);
            // Scroll to products if searching
            if (query) {
                const element = document.getElementById('products');
                element?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (!loading && products) {
            setLocalProducts(products);
        }
    }, [products, loading]);

    // Filter products based on Category and Search Query
    const filteredProducts = useMemo(() => {
        let baseProducts = localProducts;

        // If no filter or search is active, show the "Featured" collection (exactly 1 product per brand)
        if (!selectedCategory && !searchQuery) {
            const brandMap = new Map<string, Product>();
            baseProducts.forEach(product => {
                const brandName = product.brand || 'Unknown';
                if (brandName !== 'Unknown' && !brandMap.has(brandName)) {
                    brandMap.set(brandName, product);
                }
            });
            baseProducts = Array.from(brandMap.values());
        }

        return baseProducts.filter(product => {
            const matchesCategory = selectedCategory ? (
                product.category === selectedCategory ||
                product.categoryType === selectedCategory
            ) : true;

            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
                
            return matchesCategory && matchesSearch;
        });
    }, [localProducts, selectedCategory, searchQuery]);

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center', color: 'white' }}>Loading products...</div>;
    }

    if (error) {
        return <div style={{ padding: '4rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }} id="products">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '3rem',
                gap: '1.5rem'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {selectedCategory ? `${selectedCategory} Collection` : 'Featured Products'}
                </h2>

                {/* Search Bar */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '50px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)';
                            e.target.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
                            e.target.style.borderColor = 'var(--color-gold)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.05)';
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = 'var(--glass-border)';
                        }}
                    />
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '1.2rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)'
                        }}
                    />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                    <Filter size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>No products found matching your criteria.</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        style={{ marginTop: '1rem', color: 'var(--color-gold)', background: 'transparent', textDecoration: 'underline' }}
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem',
                }}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};
