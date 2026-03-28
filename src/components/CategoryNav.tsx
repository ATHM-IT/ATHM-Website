import React, { useState } from 'react';
import { Cpu, Server, Layers, ChevronDown } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';

interface CategoryNavProps {
    onSelectCategory?: (category: string | null) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ onSelectCategory }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const { products } = useProducts();
    const navigate = useNavigate();

    // Dynamically extract distinct brands for the dropdown
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)))
        .filter(b => b && b !== 'Unknown')
        .sort();

    const categories = [
        { id: 'Hardware', icon: <Cpu size={18} />, label: 'Hardware', sub: uniqueBrands },
        { id: 'Software', icon: <Layers size={18} />, label: 'Software', sub: ['OS', 'Security', 'Creative'] },
        { id: 'Services', icon: <Server size={18} />, label: 'Services', sub: ['Cloud', 'Support', 'Consulting'] },
    ];

    const handleCategoryClick = (id: string) => {
        const newCategory = activeCategory === id ? null : id;
        setActiveCategory(newCategory);
        if (onSelectCategory) {
            onSelectCategory(newCategory);
        }
    };

    const handleBrandClick = (e: React.MouseEvent, brand: string) => {
        e.stopPropagation();
        navigate(`/brand/${encodeURIComponent(brand)}`);
        setActiveCategory(null);
        setHoveredCategory(null);
    };

    return (
        <div style={{
            background: 'rgba(10, 10, 15, 0.95)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: '80px', // Below the main navbar (approx height)
            zIndex: 90,
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 2rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                overflowX: 'visible'
            }}>
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{ position: 'relative' }}
                    >
                        <div
                            onClick={() => handleCategoryClick(cat.id)}
                            style={{
                                padding: '1rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                color: activeCategory === cat.id ? 'var(--color-gold)' : 'var(--color-text-muted)',
                                borderBottom: activeCategory === cat.id ? '2px solid var(--color-gold)' : '2px solid transparent',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                                if (activeCategory !== cat.id) e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                if (activeCategory !== cat.id) e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            {cat.icon}
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {cat.label}
                            </span>
                            {cat.sub.length > 0 && <ChevronDown size={14} style={{ marginLeft: '4px' }} />}
                        </div>

                        {/* Dropdown Menu */}
                        {hoveredCategory === cat.id && cat.sub.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                background: 'var(--color-surface)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '0 0 8px 8px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: '200px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                zIndex: 100
                            }}>
                                {cat.sub.map(subItem => (
                                    <div
                                        key={subItem}
                                        onClick={(e) => handleBrandClick(e, subItem)}
                                        style={{
                                            padding: '12px 1rem',
                                            cursor: 'pointer',
                                            color: 'var(--color-text-muted)',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            transition: 'all 0.2s',
                                            fontSize: '0.9rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--color-gold)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--color-text-muted)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        {subItem}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
