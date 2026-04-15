import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import type { Product } from '../types';

interface ProductListProps {
    selectedCategory?: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({ selectedCategory }) => {
    const { products, loading, error } = useProducts();
    const [searchParams] = useSearchParams();
    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    
    // Advanced Filter State
    const [inStockOnly, setInStockOnly] = useState(true);
    const [sortBy, setSortBy] = useState('featured');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');

    // Pagination State
    const [visibleCount, setVisibleCount] = useState(24);

    // Reset pagination when filters or search change
    useEffect(() => {
        setVisibleCount(24);
    }, [searchQuery, selectedCategory, inStockOnly, minPrice, maxPrice, sortBy]);

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
        if (!selectedCategory && !searchQuery && inStockOnly && minPrice === '' && maxPrice === '' && sortBy === 'featured') {
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
                
            const matchesStock = inStockOnly ? product.stock > 0 : true;
            
            const prodPrice = product.price || product.basePrice;
            const matchesMin = minPrice !== '' ? prodPrice >= minPrice : true;
            const matchesMax = maxPrice !== '' ? prodPrice <= maxPrice : true;

            return matchesCategory && matchesSearch && matchesStock && matchesMin && matchesMax;
        }).sort((a, b) => {
            const priceA = a.price || a.basePrice;
            const priceB = b.price || b.basePrice;
            if (sortBy === 'price_asc') return priceA - priceB;
            if (sortBy === 'price_desc') return priceB - priceA;
            return 0; // featured/default
        });
    }, [localProducts, selectedCategory, searchQuery, inStockOnly, minPrice, maxPrice, sortBy]);

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
                    {selectedCategory ? `${selectedCategory} Collection` : 'Featured Hardware'}
                </h2>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '50px',
                            border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                            color: 'white', fontSize: '1rem', outline: 'none', backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Advanced Filters Sidebar */}
                <div style={{
                    flex: '1 1 250px',
                    maxWidth: '300px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '2rem',
                    height: 'fit-content',
                    position: 'sticky',
                    top: '100px'
                }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SlidersHorizontal size={20} color="var(--color-gold)" /> Filters
                    </h3>

                    {/* Stock Filter hidden as it is now automatic */}
                    {/* <div style={{ marginBottom: '1.5rem' }}>
                        <label 
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                            onClick={() => setInStockOnly(!inStockOnly)}
                        >
                            {inStockOnly ? <CheckSquare color="var(--color-gold)" size={20} /> : <Square size={20} />}
                            In Stock Only
                        </label>
                    </div> */}

                    {/* Price Range Filter */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: 'white', marginBottom: '0.8rem', fontSize: '0.9rem' }}>Price Range (ZAR)</h4>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}
                            />
                            <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    {/* Sort Filter */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '0.8rem', fontSize: '0.9rem' }}>Sort By</h4>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
                                color: 'white', borderRadius: '4px', appearance: 'none', cursor: 'pointer'
                            }}
                        >
                            <option value="featured">Featured Picks</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                <div style={{ flex: '3 1 600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                        <span>Showing {filteredProducts.length} results</span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <Filter size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>No products found matching your criteria.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setInStockOnly(false); setMinPrice(''); setMaxPrice(''); setSortBy('featured'); }}
                                style={{ marginTop: '1rem', color: 'var(--color-gold)', background: 'transparent', border: '1px solid var(--color-gold)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Reset Attributes
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '2rem',
                            }}>
                                {filteredProducts.slice(0, visibleCount).map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            
                            {visibleCount < filteredProducts.length && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 24)}
                                        style={{
                                            padding: '1rem 3rem',
                                            background: 'transparent',
                                            color: 'var(--color-gold)',
                                            border: '1px solid var(--color-gold)',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                                            e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        Load More Products
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
