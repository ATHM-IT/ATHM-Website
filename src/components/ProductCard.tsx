import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

import { AnimatedPrice } from './AnimatedPrice';
import { TrendingUp, Star } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

interface ProductCardProps {
    product: Product;
    onToggleSpecial?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onToggleSpecial }) => {
    const { isEditing } = useEditor();

    const price = product.price || product.basePrice;
    const [prevPrice, setPrevPrice] = useState<number>(price);
    const [flashColor, setFlashColor] = useState<string | null>(null);

    useEffect(() => {
        if (price !== prevPrice) {
            // Price dropped = Green, Price increased = Red
            setFlashColor(price < prevPrice ? '#22c55e' : '#ef4444');
            const timer = setTimeout(() => {
                setFlashColor(null);
                setPrevPrice(price);
            }, 2000); // 2-second flash
            return () => clearTimeout(timer);
        }
    }, [price, prevPrice]);

    const priceColor = flashColor || 'var(--color-gold)';

    return (
        <div style={{
            background: 'var(--color-surface)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            transition: 'var(--transition-smooth)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
                e.currentTarget.style.borderColor = 'var(--color-gold)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}
        >
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Link>

                {/* Live Badge */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'var(--color-gold)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid var(--color-gold)'
                }}>
                    <TrendingUp size={14} /> Live
                </div>

                {/* Special Badge (Always visible if special) */}
                {product.isSpecial && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'var(--color-gold)',
                        color: 'black',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        zIndex: 5
                    }}>
                        SPECIAL
                    </div>
                )}

                {/* Admin Special Toggle (Only visible in Edit Mode) */}
                {isEditing && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (onToggleSpecial) onToggleSpecial();
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            background: product.isSpecial ? 'var(--color-gold)' : 'rgba(0,0,0,0.6)',
                            color: product.isSpecial ? 'black' : 'white',
                            border: '1px solid var(--color-gold)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                        title="Toggle Special Status"
                    >
                        <Star size={16} fill={product.isSpecial ? 'black' : 'none'} />
                    </button>
                )}
            </div>

            <Link to={`/product/${product.id}`} style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
                <h3 style={{ 
                    marginBottom: '1rem', 
                    fontSize: '1.1rem', 
                    color: 'var(--color-text-main)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                }}>
                    {product.name}
                </h3>
                
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ 
                        fontSize: '1.4rem', 
                        fontWeight: 'bold', 
                        color: priceColor,
                        transform: flashColor ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.5s ease-out' 
                    }}>
                        <AnimatedPrice price={price} prefix="R " />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        Incl. VAT & Fees
                    </div>
                </div>
            </Link>
        </div>
    );
};
